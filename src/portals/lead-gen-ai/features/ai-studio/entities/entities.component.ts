import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PopupService, SharedService, TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService, StudioEntity, Evidence, Agent } from '../ai-studio.service';
import { StudioEntityCeComponent } from './components/studio-entity-ce.component';
import { StudioSelectCellComponent, StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

/** One audit entry shown in the dossier research timeline. */
interface ResearchEntry { at: string; text: string }

type Mode = 'db' | 'score' | 'contacts';

/** EP-03 — Entity taxonomy, weighted scoring rubric and explainable dossiers. */
@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, PaginationComponent],
  template: `
  <div class="ent">
    <div class="page-head">
      <div><h1>Entity Database</h1><p class="sub">Unified taxonomy — prospects, customers, candidates, employers, opportunities</p></div>
      <div class="filters">
        <button class="chip" [class.on]="mode==='db'" (click)="mode='db'">Database</button>
        <button class="chip" [class.on]="mode==='score'" (click)="mode='score'">Qualification Scoring</button>
        <button class="chip" [class.on]="mode==='contacts'" (click)="mode='contacts'">Contacts</button>
        <span style="flex:1"></span>
        <button class="btn" (click)="exportCsv()">CSV</button>
        <button class="btn primary" (click)="openForm()">+ New entity</button>
      </div>
    </div>

    <!-- classification filter tabs -->
    <div class="cls-tabs">
      <button class="chip" *ngFor="let c of classes" [class.on]="cls===c.value" (click)="setCls(c.value)">{{ c.label }}</button>
      <span style="flex:1"></span>
      <span class="muted">{{ totalCount }} records</span>
    </div>

    <!-- database -->
    <ng-container *ngIf="mode==='db'">
      <org-grid [data]="entities" [options]="gridOptions" [isLoading]="loading" (cb)="openForm($event)"></org-grid>
      <org-grid-pagination [page]="page" [count]="totalCount" [perPage]="pageSize" [loading]="loading" (cb)="onPage($event)"></org-grid-pagination>
    </ng-container>

    <!-- qualification scoring -->
    <section class="card" *ngIf="mode==='score'">
      <div class="rubric">
        <div class="field">
          <label>Qualification gate ({{ gate }}%)</label>
          <input type="range" min="50" max="95" [(ngModel)]="gate" (change)="saveScoring()"/>
        </div>
        <div class="field" *ngFor="let w of weightKeys">
          <label>{{ w.label }} <b>{{ weights[w.key] }}%</b></label>
          <input type="range" min="5" max="60" [(ngModel)]="weights[w.key]" (change)="saveScoring()"/>
        </div>
        <button class="btn" (click)="resetWeights()">Reset defaults</button>
        <span class="muted">Weights auto-normalize to 100%. Rows flip between Qualified Gate and Watchlist live.</span>
      </div>
      <div class="funnel" *ngFor="let e of scoredEntities.slice(0,20)">
        <div class="f-label">{{ e.name }}</div>
        <div class="f-bar"><div class="f-fill" [style.width.%]="e.adjScore"></div></div>
        <div class="f-count"><span class="badge" [class.ok]="e.adjScore>=gate" [class.warn]="e.adjScore<gate">{{ e.adjScore>=gate ? 'Qualified' : 'Watchlist' }} · {{ e.adjScore }}</span></div>
      </div>
      <p class="muted" *ngIf="!scoredEntities.length">No entities to score.</p>
    </section>

    <!-- contacts directory -->
    <section class="card" *ngIf="mode==='contacts'">
      <org-grid [data]="withContacts" [options]="contactsGrid"></org-grid>
      <p class="muted" *ngIf="!withContacts.length">No contacts on file.</p>
    </section>

    <!-- bulk action bar -->
    <div class="bulkbar" *ngIf="checkedCount">
      <b>{{ checkedCount }} selected</b>
      <select [(ngModel)]="bulkStage"><option value="">Move to stage…</option><option *ngFor="let st of stages" [value]="st">{{ st }}</option></select>
      <select [(ngModel)]="bulkAgentId"><option value="">Assign agent…</option><option *ngFor="let a of agents" [value]="a.id">{{ a.name }}</option></select>
      <button class="btn" (click)="bulkApply()">Apply</button>
      <button class="btn" (click)="clearChecks()">Clear</button>
    </div>

    <!-- dossier -->
    <aside class="dossier" *ngIf="sel">
      <div class="d-head"><h3>{{ sel.name }}</h3><button class="btn" (click)="sel=null">✕</button></div>
      <p class="muted">{{ sel.classification }} · confidence {{ sel.score }}/100 · {{ sel.stage }}</p>
      <p class="nba"><b>Recommended next action:</b> {{ nextBestAction(sel) }}</p>

      <div class="d-acts">
        <button class="btn" (click)="openForm(sel)">Edit</button>
        <button class="btn" (click)="next(sel)">Advance stage →</button>
        <button class="btn danger" (click)="remove(sel)">Delete</button>
      </div>

      <h4>Evidence ({{ evidence(sel).length }})</h4>
      <div class="ev" *ngFor="let ev of evidence(sel)">
        <div class="ev-top"><span [class.v]="ev.verified" [class.flag]="ev.flagged">{{ ev.verified ? '✓' : ev.flagged ? '⚑' : '○' }}</span>
          <b>{{ ev.label }}</b></div>
        <small class="muted">{{ ev.source }}</small>
        <div class="ev-acts">
          <button class="mini" (click)="verify(sel, ev)" *ngIf="!ev.verified">Mark verified</button>
          <button class="mini" (click)="flag(sel, ev)">Flag discrepancy</button>
        </div>
      </div>
      <button class="btn" (click)="verifyPending(sel)" [disabled]="!hasPending(sel)">Verify pending sources</button>

      <h4>Add analyst evidence</h4>
      <div class="add-ev">
        <input [(ngModel)]="newEvLabel" placeholder="Finding (e.g. Hire 5 platform engineers)"/>
        <input [(ngModel)]="newEvSource" placeholder="Source (e.g. LinkedIn jobs)"/>
        <button class="btn" (click)="addEvidence(sel)">Add</button>
      </div>

      <h4>Compose cited outreach</h4>
      <div class="outreach">
        <div class="oa-actions">
          <select [(ngModel)]="outreachChannel"><option value="email">Email</option><option value="linkedin">LinkedIn</option><option value="sms">SMS</option></select>
          <button class="mini" (click)="draftOutreach(sel)">Draft from evidence</button>
        </div>
        <textarea [(ngModel)]="outreachBody" rows="4" placeholder="Cited outreach message…"></textarea>
        <button class="btn primary" (click)="sendOutreach(sel)" [disabled]="!outreachBody.trim()">Send &amp; track in Inbox</button>
      </div>

      <h4>Research &amp; audit history</h4>
      <div class="hist"><div class="h-item" *ngFor="let h of historyOf(sel)"><small class="muted">{{ h.at | date:'MMM d, h:mm a' }}</small><div>{{ h.text }}</div></div>
        <p class="muted" *ngIf="!historyOf(sel).length">No analyst activity yet.</p></div>

      <h4>Decision makers &amp; contacts</h4>
      <p class="muted">{{ contact(sel) || '—' }}</p>
    </aside>
  </div>`,
  styles: [`
    .ent{padding:16px;max-width:1200px;margin:0 auto;position:relative}
    .cls-tabs{display:flex;gap:6px;align-items:center;margin-bottom:10px;flex-wrap:wrap}
    .filters{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
    .chip{padding:4px 10px;border-radius:14px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .chip.on{background:#3467d6;color:#fff;border-color:#3467d6}
    .btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn.danger{color:#c0392b;border-color:#f3c1c1}
    .btn:disabled{opacity:.5;cursor:default}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px;margin-bottom:14px}
    .muted{color:var(--muted,#888);font-size:12px}
    .rubric{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-bottom:14px}
    .rubric .field label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}
    .rubric input[type=range]{width:100%;accent-color:#3467d6}
    .rubric .btn{grid-column:1/-1;width:fit-content}
    .dossier{position:fixed;right:0;top:0;bottom:0;width:380px;background:var(--card,#fff);border-left:1px solid var(--border,#eee);padding:16px;overflow:auto;box-shadow:-4px 0 16px rgba(0,0,0,.08);z-index:50}
    .d-head{display:flex;justify-content:space-between;align-items:center}h4{margin:16px 0 6px;font-size:13px}
    .d-acts{display:flex;gap:8px;margin:10px 0}
    .nba{background:#f0f6ff;border-radius:8px;padding:8px 10px;font-size:12px}
    .funnel{display:grid;grid-template-columns:140px 1fr 130px;gap:8px;align-items:center;padding:5px 0;font-size:13px}
    .f-label{color:var(--muted,#888);font-size:12px}.f-bar{height:8px;background:#eef1f8;border-radius:4px;overflow:hidden}
    .f-fill{height:100%;background:linear-gradient(90deg,#3467d6,#6ea8ff);border-radius:4px}
    .f-count{text-align:right}.badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:#eee}
    .badge.ok{background:#d9f2e4;color:#1a7f4b}.badge.warn{background:#fef3c7;color:#92400e}
    .bulkbar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 18px;border-radius:12px;display:flex;gap:10px;align-items:center;box-shadow:0 8px 30px rgba(0,0,0,.3);z-index:80}
    .bulkbar select{padding:6px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#fff}
    .bulkbar .btn{background:#334155;border-color:#475569;color:#fff}
    .ev{padding:6px 0;border-bottom:1px solid var(--border,#f5f5f5);font-size:13px}
    .ev .v{color:#1a9e5c}.ev .flag{color:#d97706}.ev small{display:block}.ev-top{display:flex;gap:6px;align-items:center}
    .ev-acts{display:flex;gap:6px;margin-top:4px}
    .mini{font-size:11px;padding:2px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .add-ev,.oa-actions{display:flex;gap:6px;margin-bottom:6px}
    .add-ev input,.outreach textarea,.outreach select,.add-ev select{padding:6px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit;font-size:12px}
    .add-ev input{flex:1;min-width:0}
    .outreach textarea{width:100%;box-sizing:border-box;resize:vertical}
    .outreach .btn{width:100%;margin-top:6px}
    .hist .h-item{border-left:2px solid #e2e8f0;padding:2px 0 6px 10px;font-size:12px;margin-left:3px}
  `]
})
export class EntitiesComponent implements OnInit {
  studio = inject(AiStudioService);
  popup = inject(PopupService);
  shared = inject(SharedService);
  router = inject(Router); route = inject(ActivatedRoute);

  classes = [
    { label: 'All', value: '' }, { label: 'Prospect', value: 'Prospect' }, { label: 'Customer', value: 'Customer' },
    { label: 'Candidate', value: 'Candidate' }, { label: 'Employer', value: 'Employer' }, { label: 'Opportunity', value: 'Opportunity' },
  ];
  cls = ''; entities: StudioEntity[] = []; sel?: StudioEntity;
  page = 1; pageSize = 25; totalCount = 0; loading = false;
  mode: Mode = 'db';
  agents: Agent[] = [];

  gridOptions: any = {
    header: { title: 'Entities', desc: null, add: false, refresh: true, edit: true, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: '_sel', headerName: '', class: 'w-check', cellTemplate: StudioSelectCellComponent },
      { field: 'name', headerName: 'Name' },
      { field: 'classification', headerName: 'Class' },
      { field: 'score', headerName: 'Score', cellFn: (e: StudioEntity) => e.score + '/100' },
      { field: 'stage', headerName: 'Stage' },
      { field: 'source', headerName: 'Source' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [{ label: 'Dossier', run: (e: StudioEntity) => this.openDossier(e) }] },
    ],
  };
  contactsGrid: any = {
    header: { title: 'Contacts directory', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Organization' },
      { headerName: 'Contact', cellFn: (e: StudioEntity) => this.contactParts(e)?.name || '—' },
      { headerName: 'Role', cellFn: (e: StudioEntity) => this.contactParts(e)?.role || '—' },
      { headerName: 'Email', cellFn: (e: StudioEntity) => this.contactParts(e)?.email || '—' },
      { field: 'stage', headerName: 'Stage' },
      { field: 'score', headerName: 'Score' },
    ],
  };

  get stages(): string[] { return this.studio.industry?.stages ?? []; }
  get withContacts() { return this.entities.filter(e => !!this.contactParts(e)); }

  ngOnInit() {
    if (this.studio.pendingEntityId) {
      const id = this.studio.pendingEntityId; this.studio.pendingEntityId = undefined;
      this.studio.getEntity(id).subscribe(e => { if (e) this.sel = e; });
    }
    this.studio.getScoring().subscribe(s => { this.gate = s.gateThreshold; Object.assign(this.weights, s.weights); });
    this.studio.listAgents(1, 200).subscribe(p => this.agents = p.items);
    this.load();
  }
  load() {
    this.loading = true;
    this.studio.listEntitiesPaged(this.cls || undefined, this.page, this.pageSize).subscribe({
      next: p => { this.entities = p.items; this.totalCount = p.totalCount; this.loading = false; },
      error: () => this.loading = false,
    });
  }
  setCls(c: string) { this.cls = c; this.page = 1; this.load(); }
  onPage(e: { skip: number; take: number }) { this.pageSize = e.take; this.page = Math.floor(e.skip / e.take) + 1; this.load(); }
  openDossier(e: StudioEntity) { this.sel = e; this.draftOutreach(e); }

  evidence(e: StudioEntity): Evidence[] { return this.studio.evidenceOf(e); }
  hasPending(e: StudioEntity) { return this.evidence(e).some(ev => !ev.verified); }
  contact(e: StudioEntity) { const c = this.contactParts(e); return c ? `${c.name} · ${c.role} · ${c.email}` : ''; }
  contactParts(e: StudioEntity): any { try { return JSON.parse(e.contactJson || 'null'); } catch { return null; } }
  nextBestAction(e: StudioEntity): string {
    const top = this.evidence(e).find(ev => ev.verified) ?? this.evidence(e)[0];
    return top ? `Lead with "${top.label}" and propose a scoped intro call.` : 'Verify evidence, then propose a scoped intro call.';
  }
  private save(e: StudioEntity, note?: string) {
    this.studio.updateEntity(e.id, { ...e, evidenceJson: JSON.stringify(this.evidence(e)) } as StudioEntity).subscribe(() => {
      if (note) this.log(e, note);
      this.load();
    });
  }
  verify(e: StudioEntity, ev: Evidence) { ev.verified = true; ev.flagged = false; this.save(e, `Evidence verified: ${ev.label}`); }
  flag(e: StudioEntity, ev: Evidence) { ev.flagged = true; ev.verified = false; this.save(e, `Discrepancy flagged: ${ev.label}`); }
  verifyPending(e: StudioEntity) {
    const pending = this.evidence(e).filter(ev => !ev.verified);
    if (!pending.length) return;
    pending.forEach(ev => ev.verified = true);
    const boost = pending.length * 5;
    const updated = { ...e, score: Math.min(100, e.score + boost), evidenceJson: JSON.stringify(this.evidence(e)) } as StudioEntity;
    this.studio.updateEntity(e.id, updated).subscribe(() => {
      this.sel = updated; this.log(e, `${pending.length} pending source(s) promoted to Verified (+${boost} confidence)`); this.load();
    });
  }
  newEvLabel = ''; newEvSource = '';
  addEvidence(e: StudioEntity) {
    if (!this.newEvLabel.trim()) return;
    const list = this.evidence(e); list.push({ label: this.newEvLabel.trim(), source: this.newEvSource.trim() || 'Analyst entry', verified: false });
    const updated = { ...e, evidenceJson: JSON.stringify(list) } as StudioEntity;
    this.studio.updateEntity(e.id, updated).subscribe(() => { this.sel = updated; this.newEvLabel = ''; this.newEvSource = ''; this.log(e, 'Analyst evidence added'); this.load(); });
  }

  // ── research & audit timeline (session-scoped) ──
  private history: Record<string, ResearchEntry[]> = {};
  historyOf(e: StudioEntity): ResearchEntry[] { return this.history[e.id] ?? []; }
  private log(e: StudioEntity, text: string) {
    (this.history[e.id] ??= []).unshift({ at: new Date().toISOString(), text });
  }

  // ── cited outreach → Inbox ──
  outreachChannel = 'email'; outreachBody = '';
  draftOutreach(e: StudioEntity) {
    const top = this.evidence(e).find(ev => ev.verified) ?? this.evidence(e)[0];
    const who = this.contactParts(e)?.name ?? 'there';
    this.outreachBody =
      `Hi ${who},\n\nWe noticed ${e.name} — ${top ? `sourced from ${top.source}: "${top.label}"` : 'a match for our programme'}. ` +
      `Based on that signal we think there's a strong fit.\n\n${this.nextBestAction(e)}\n\nWorth a quick 15-minute call?`;
  }
  sendOutreach(e: StudioEntity) {
    if (!this.outreachBody.trim()) return;
    this.studio.createThread(e.id, this.outreachChannel, `Outreach: ${e.name}`).subscribe(th => {
      this.studio.postMessage(th.id, 'outbound', this.outreachBody.trim(), false).subscribe(() => {
        this.log(e, `Cited outreach sent via ${this.outreachChannel}`);
        this.studio.pendingThreadId = th.id;
        this.sel = undefined;
        const ws = this.studio.workspace?.key ?? 'business-growth';
        this.router.navigate([ws, 'inbox'], { relativeTo: this.route.parent });
      });
    });
  }

  // ── weighted scoring rubric (EP-03 / US-3.2) ──
  gate = 80;
  weights: any = { signal: 30, capacity: 25, urgency: 25, reachability: 20 };
  weightKeys = [
    { key: 'signal', label: 'Buying / Tech Signal' }, { key: 'capacity', label: 'Financial Capacity' },
    { key: 'urgency', label: 'Hiring / Timing Urgency' }, { key: 'reachability', label: 'Contact Reachability' },
  ];
  computeWeightedScore(e: StudioEntity, w: any): number {
    const total = (w.signal + w.capacity + w.urgency + w.reachability) || 1;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const base = e.score / 100;
    const r = { signal: clamp(base), capacity: clamp(base + 0.05), urgency: clamp(base - 0.03), reachability: clamp(base + 0.02) };
    const raw = (r.signal * w.signal + r.capacity * w.capacity + r.urgency * w.urgency + r.reachability * w.reachability) / total;
    return Math.round(clamp(raw) * 100);
  }
  get scoredEntities() { return this.entities.map(e => ({ ...e, adjScore: this.computeWeightedScore(e, this.weights) })).sort((a, b) => b.adjScore - a.adjScore); }
  saveScoring() { this.studio.putScoring(this.gate, this.weights).subscribe(); }
  resetWeights() { this.gate = 80; this.weights = { signal: 30, capacity: 25, urgency: 25, reachability: 20 }; this.saveScoring(); }

  // ── bulk actions (EP-03 / US-3.1) ──
  bulkStage = ''; bulkAgentId = '';
  get checkedCount() { return this.entities.filter(e => (e as any).isChecked).length; }
  clearChecks() { this.entities.forEach(e => (e as any).isChecked = false); }
  bulkApply() {
    const ids = this.entities.filter(e => (e as any).isChecked).map(e => e.id);
    if (!ids.length || (!this.bulkStage && !this.bulkAgentId)) return;
    this.studio.bulkEntities(ids, this.bulkStage || undefined, this.bulkAgentId || undefined).subscribe(() => {
      this.clearChecks(); this.bulkStage = ''; this.bulkAgentId = ''; this.load();
    });
  }

  // ── CRUD ──
  next(e: StudioEntity) {
    const stages = this.stages; const i = stages.indexOf(e.stage);
    this.studio.moveStage(e.id, stages[Math.min(i + 1, stages.length - 1)]).subscribe(() => this.load());
  }
  remove(e: StudioEntity) {
    if (!confirm(`Delete "${e.name}"?`)) return;
    this.studio.deleteEntity(e.id).subscribe(() => { this.sel = undefined; this.load(); });
  }
  exportCsv() {
    const esc = (v: any) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const rows = [['Name', 'Class', 'Score', 'Stage', 'Source'], ...this.entities.map(e => [e.name, e.classification, e.score, e.stage, e.source])];
    const csv = rows.map(r => r.map(esc).join(',')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'entities.csv'; a.click();
  }
  openForm(e?: StudioEntity) {
    const isEdit = !!e;
    this.popup.showCustomPopup(StudioEntityCeComponent,
      { header: { text: isEdit ? 'Edit entity' : 'New entity' }, aside: 'modal-right', size: 'w-50' },
      { id: e?.id ?? null, data: e ?? {}, actionType: 'Show' })
      .then(() => this.load()).catch(() => this.load());
  }
}
