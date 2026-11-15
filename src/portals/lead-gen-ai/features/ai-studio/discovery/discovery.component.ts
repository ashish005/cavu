import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AiStudioService, Run, StudioEntity } from '../ai-studio.service';

const SOURCES = [
  { key: 'registry', label: 'Corporate Filings & Registries', category: 'Registry', scope: 'Public Filings · Read-Only', latency: '1.2s', volume: '14.2M' },
  { key: 'web', label: 'Web Stack & Infrastructure Scanner', category: 'Web Signal', scope: 'Permitted DNS/HTTP · Verified', latency: '0.8s', volume: '8.9M' },
  { key: 'job-boards', label: 'Global Career & Hiring Boards', category: 'Job Board', scope: 'Partner API · Rate-Limited', latency: '1.5s', volume: '3.4M' },
  { key: 'directories', label: 'Local Clinical & Practice Directories', category: 'Directory', scope: 'Verified Licensing · HIPAA-Safe', latency: '1.1s', volume: '1.8M' },
  { key: 'tenders', label: 'Municipal & Enterprise RFP Portals', category: 'Tender Portal', scope: 'Public Procurement Feed', latency: '2.0s', volume: '420K' },
];
const CLASSES = ['Prospect', 'Opportunity', 'Employer', 'Candidate', 'Customer'];
const GATES = [65, 75, 85];

/** Discovery Studio — spec: presets, query builder, source catalogue, runs log, attributed output. */
@Component({
  selector: 'app-discovery-studio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="ds">
    <div class="page-head">
      <div><h1>Multi-Source Discovery Studio</h1><p class="sub">Permission-scoped intake across registries, job boards, directories & web signals</p></div>
      <span class="armed">{{ selected.size }} of {{ sources.length }} sources armed</span>
    </div>

    <div class="cols">
      <!-- B: query builder -->
      <section class="card">
        <h3>Search criteria &amp; saved queries</h3>
        <div class="presets" *ngIf="presets.length">
          <small class="muted">Saved for {{ studio.workspace?.label }}:</small>
          <button class="chip" *ngFor="let p of presets" (click)="applyPreset(p)">{{ p.name }}</button>
        </div>
        <div class="field"><label>Discovery intent &amp; signal query</label>
          <textarea [(ngModel)]="query" rows="3" placeholder="e.g. B2B companies modernizing legacy portals, hiring platform engineers…"></textarea></div>
        <div class="row3">
          <div class="field"><label>Geographic targeting</label><input [(ngModel)]="geography" placeholder="Global"/></div>
          <div class="field"><label>Entity classification</label>
            <select [(ngModel)]="entityType"><option *ngFor="let c of classes" [value]="c">{{ c }}</option></select></div>
          <div class="field"><label>Min confidence gate</label>
            <select [(ngModel)]="minScore"><option *ngFor="let g of gates" [ngValue]="g">{{ g }} / 100</option></select></div>
        </div>
        <div class="actions">
          <button class="btn" (click)="savePreset()">Save search</button>
          <button class="btn primary" [disabled]="!query.trim() || !selected.size || scanning" (click)="run()">
            {{ scanning ? 'Scanning sources…' : '▶ Run discovery' }}</button>
          <button class="btn" *ngIf="lastRun" (click)="rerun()">↻ Re-run</button>
        </div>
      </section>

      <!-- C: sources -->
      <section class="card">
        <h3>Permitted discovery sources</h3>
        <label class="src" *ngFor="let s of sources" [class.on]="selected.has(s.key)">
          <input type="checkbox" [checked]="selected.has(s.key)" (change)="toggle(s.key)"/>
          <div class="src-body"><b>{{ s.label }}</b>
            <div class="muted">{{ s.category }} · {{ s.scope }}</div>
            <div class="muted">{{ s.latency }} avg · {{ s.volume }} indexed</div></div>
        </label>
      </section>
    </div>

    <!-- D: runs log -->
    <section class="card">
      <h3>Discovery runs &amp; attribution log</h3>
      <table><thead><tr><th>Run</th><th>Query &amp; geography</th><th>Sources</th><th>Discovered</th><th>Qualified</th><th></th></tr></thead>
        <tbody><tr *ngFor="let r of runs">
          <td class="mono">{{ shortId(r.id) }}<div class="muted">{{ r.ranAt | date:'MMM d, h:mm a' }}</div></td>
          <td>{{ r.query }}<div class="muted">{{ r.geography || 'Global' }}</div></td>
          <td>{{ srcs(r) }}</td><td>{{ r.results }}</td><td><b>{{ r.qualifiedCount ?? '—' }}</b></td>
          <td><button class="mini" (click)="rerunRun(r)">Re-run</button></td>
        </tr></tbody></table>
      <p class="muted" *ngIf="!runs.length">No runs yet.</p>
    </section>

    <!-- E: attributed output -->
    <section class="card">
      <h3>Attributed discovery output</h3>
      <table><thead><tr><th>Entity</th><th>Classification</th><th>Primary source</th><th>Stage</th><th class="r">Confidence</th><th></th></tr></thead>
        <tbody><tr *ngFor="let e of outputEntities">
          <td><b>{{ e.name }}</b><div class="muted">{{ e.classification }}</div></td>
          <td>{{ e.classification }}</td><td>{{ e.source }}</td><td>{{ e.stage }}</td>
          <td class="r mono">{{ e.score }}/100</td>
          <td class="r"><button class="mini" (click)="inspect(e)">Open Dossier</button></td>
        </tr></tbody></table>
      <p class="muted" *ngIf="!outputEntities.length">Run discovery to generate attributed records.</p>
    </section>
  </div>`,
  styles: [`
    .armed{background:#ecfdf5;color:#047857;font-weight:700;font-size:13px;padding:6px 14px;border-radius:20px}
    .cols{display:grid;grid-template-columns:7fr 5fr;gap:14px;margin-bottom:14px}
    .presets{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
    .field{margin-bottom:10px}.field label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}
    input,select,textarea{width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid #cbd5e1;font-size:13px}
    textarea{resize:vertical}.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
    .actions{display:flex;gap:8px;margin-top:4px}
    .btn{padding:8px 16px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;cursor:pointer;font-size:13px}
    .btn.primary{background:#2563EB;color:#fff;border-color:#2563EB}.btn:disabled{opacity:.5;cursor:default}
    .src{display:flex;gap:10px;padding:10px;border:1px solid #eef2f7;border-radius:10px;margin-bottom:8px;cursor:pointer}
    .src.on{border-color:#2563EB;background:#f5f8ff}
    .src input{width:auto}.src-body{flex:1}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:8px;border-bottom:1px solid #f1f5f9;text-align:left}
    .r{text-align:right}.mono{font-variant-numeric:tabular-nums}
    .mini{padding:4px 10px;border-radius:6px;border:1px solid #cbd5e1;background:#fff;font-size:12px;cursor:pointer}
    .mini:hover{border-color:#2563EB;color:#2563EB}
    .muted{color:#64748b;font-size:12px}
  `]
})
export class DiscoveryStudioComponent implements OnInit {
  studio = inject(AiStudioService); router = inject(Router); route = inject(ActivatedRoute);
  sources = SOURCES; classes = CLASSES; gates = GATES;
  selected = new Set<string>(['registry', 'web', 'job-boards']);
  query = ''; geography = 'Global'; entityType = 'Prospect'; minScore = 75;
  runs: Run[] = []; lastRun?: Run; scanning = false; presets: any[] = [];
  get outputEntities(): StudioEntity[] { return this.studio.entities$.value.slice(0, 8); }

  ngOnInit() {
    this.studio.runs$.subscribe(r => this.runs = r);
    this.studio.entities$.subscribe(() => {});
    this.studio.listRuns().subscribe(); this.studio.refreshAll();
    const ws = this.studio.workspace?.key;
    if (ws) this.studio.listPresets(ws).subscribe(p => this.presets = p);
  }
  toggle(k: string) { this.selected.has(k) ? this.selected.delete(k) : this.selected.add(k); }
  srcs(r: Run) { try { return JSON.parse(r.sourcesJson).map((k: string) => SOURCES.find(s => s.key === k)?.label ?? k).join(', '); } catch { return r.sourcesJson; } }
  shortId(id: string) { return 'RUN-' + id.replace(/-/g, '').slice(0, 4).toUpperCase(); }

  applyPreset(p: any) {
    const q = p.query ?? {};
    this.query = q.query ?? this.query; this.geography = q.geo ?? this.geography;
    this.entityType = q.classification ?? this.entityType; this.minScore = q.minScore ?? this.minScore;
  }
  savePreset() {
    const name = prompt('Preset name:'); if (!name) return;
    this.studio.savePreset(name, { query: this.query, geo: this.geography, classification: this.entityType, minScore: this.minScore }, this.studio.workspace?.key)
      .subscribe(() => this.studio.listPresets(this.studio.workspace?.key).subscribe(p => this.presets = p));
  }
  run() {
    this.scanning = true;
    this.studio.runDiscovery(this.query.trim(), [...this.selected], this.geography, this.entityType, this.minScore)
      .subscribe(r => { this.lastRun = r; this.scanning = false; this.studio.refreshAll(); });
  }
  rerun() { if (this.lastRun) this.rerunRun(this.lastRun); }
  rerunRun(r: Run) {
    let srcs: string[] = []; try { srcs = JSON.parse(r.sourcesJson); } catch { }
    this.scanning = true;
    this.studio.runDiscovery(r.query, srcs, r.geography || 'Global', this.entityType, this.minScore)
      .subscribe(() => { this.scanning = false; this.studio.refreshAll(); });
  }
  inspect(e: StudioEntity) { this.studio.pendingEntityId = e.id; const ws = this.studio.workspace?.key ?? 'business-growth'; this.router.navigate([ws, 'entities'], { relativeTo: this.route.parent }); }
}
