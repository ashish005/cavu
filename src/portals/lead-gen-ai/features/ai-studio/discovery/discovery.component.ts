import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Run } from '../ai-studio.service';

const SOURCES = [
  { key: 'web', label: 'Web search', scope: 'public web', latency: 'fast', volume: '10M+' },
  { key: 'linkedin', label: 'LinkedIn', scope: 'professional profiles', latency: 'medium', volume: '500M' },
  { key: 'crm', label: 'CRM', scope: 'existing contacts', latency: 'instant', volume: 'org' },
  { key: 'job-boards', label: 'Job boards', scope: 'open roles', latency: 'medium', volume: '2M' },
  { key: 'directories', label: 'Directories', scope: 'local listings', latency: 'slow', volume: '50M' },
];

@Component({
  selector: 'app-discovery-studio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="ds">
    <h2>Discovery Studio</h2>
    <div class="cols">
      <section class="card">
        <h3>Sources <span class="muted">{{ armed }}/{{ sources.length }} armed</span></h3>
        <label class="src" *ngFor="let s of sources" [class.on]="selected.has(s.key)">
          <input type="checkbox" [checked]="selected.has(s.key)" (change)="toggle(s.key)"/>
          <span><b>{{ s.label }}</b><small>{{ s.scope }} · {{ s.latency }} · {{ s.volume }}</small></span>
        </label>
      </section>
      <section class="card">
        <h3>Search builder</h3>
        <textarea [(ngModel)]="query" placeholder="Describe who you're looking for…" rows="3"></textarea>
        <div class="row2">
          <input [(ngModel)]="geography" placeholder="Geography (e.g. US, Texas)"/>
          <select [(ngModel)]="entityType"><option>Prospect</option><option>Candidate</option><option>Employer</option><option>Opportunity</option></select>
          <select [(ngModel)]="minScore"><option [ngValue]="50">Score ≥ 50</option><option [ngValue]="70">≥ 70</option><option [ngValue]="85">≥ 85</option></select>
        </div>
        <div class="actions">
          <button class="btn primary" [disabled]="!query.trim() || !armed" (click)="run()">▶ Run discovery</button>
          <button class="btn" (click)="savePreset()">Save search</button>
          <button class="btn" *ngIf="lastRun" (click)="rerun()">↻ Re-run</button>
        </div>
      </section>
    </div>
    <section class="card">
      <h3>Discovery runs</h3>
      <table><thead><tr><th>Query</th><th>Sources</th><th>Results</th><th>When</th></tr></thead>
      <tbody><tr *ngFor="let r of runs"><td>{{ r.query }}</td><td>{{ srcs(r) }}</td><td>{{ r.results }}</td><td>{{ r.ranAt | date:'short' }}</td></tr></tbody></table>
      <p class="muted" *ngIf="!runs.length">No runs yet.</p>
    </section>
  </div>`,
  styles: [`
    .ds{padding:16px;max-width:1100px;margin:0 auto}.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px;margin-bottom:14px}
    h2{margin:0 0 14px}h3{margin:0 0 10px;font-size:14px}.muted{color:var(--muted,#888);font-size:12px;font-weight:400}
    .src{display:flex;gap:10px;align-items:center;padding:8px;border:1px solid var(--border,#eee);border-radius:8px;margin-bottom:6px;cursor:pointer}
    .src.on{border-color:#4f8cff;background:#f0f6ff}.src small{display:block;color:var(--muted,#888)}
    textarea,input,select{width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit;margin-bottom:8px}
    .row2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.actions{display:flex;gap:8px}
    .btn{padding:7px 14px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn:disabled{opacity:.5;cursor:default}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:6px 8px;border-bottom:1px solid var(--border,#f0f0f0);text-align:left}
  `]
})
export class DiscoveryStudioComponent implements OnInit {
  studio = inject(AiStudioService);
  sources = SOURCES; selected = new Set<string>(['web', 'crm']);
  query = ''; geography = ''; entityType = 'Prospect'; minScore = 50;
  runs: Run[] = []; lastRun?: Run; armed = 2;
  ngOnInit() { this.studio.runs$.subscribe(r => this.runs = r); this.studio.listRuns().subscribe(); }
  toggle(k: string) { this.selected.has(k) ? this.selected.delete(k) : this.selected.add(k); this.armed = this.selected.size; }
  run() {
    this.studio.runDiscovery(this.query.trim(), [...this.selected]).subscribe(r => this.lastRun = r);
    this.query = '';
  }
  rerun() { if (this.lastRun) this.studio.runDiscovery(this.lastRun.query, JSON.parse(this.lastRun.sourcesJson || '[]')).subscribe(r => this.lastRun = r); }
  savePreset() { localStorage.setItem('ds-preset', JSON.stringify({ query: this.query, sources: [...this.selected], geo: this.geography })); }
  srcs(r: Run) { try { return JSON.parse(r.sourcesJson).join(', '); } catch { return r.sourcesJson; } }
}
