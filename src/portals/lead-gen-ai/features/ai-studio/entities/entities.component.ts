import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupService, SharedService, TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService, StudioEntity, Evidence } from '../ai-studio.service';
import { StudioEntityCeComponent } from './components/studio-entity-ce.component';

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, PaginationComponent],
  template: `
  <div class="ent">
    <div class="page-head">
      <div><h1>Entity Database</h1><p class="sub">Unified taxonomy — prospects, customers, candidates, employers, opportunities</p></div>
      <div class="filters">
        <button class="chip" [class.on]="sub==='db'" (click)="sub='db'">Database</button>
        <button class="chip" [class.on]="sub==='score'" (click)="sub='score'">Qualification Scoring</button>
        <button class="chip" [class.on]="sub==='contacts'" (click)="sub='contacts'">Contacts</button>
        <span style="flex:1"></span>
        <button class="btn" (click)="exportCsv()">CSV</button>
        <button class="btn primary" (click)="openForm()">+ New entity</button>
      </div>
    </div>

    <org-grid *ngIf="sub==='db'" [data]="entities" [options]="gridOptions" [isLoading]="loading" (cb)="sel=$event"></org-grid>
    <org-grid-pagination *ngIf="sub==='db'" [page]="page" [count]="totalCount" [perPage]="pageSize" [loading]="loading" (cb)="onPage($event)"></org-grid-pagination>

    <!-- Qualification scoring sub-tab -->
    <section class="card" *ngIf="sub==='score'">
      <h3>Qualification gate: {{ gate }}%</h3>
      <input type="range" min="50" max="95" [(ngModel)]="gate" (change)="saveScoring()" style="width:100%"/>
      <div class="funnel" *ngFor="let e of scoredEntities.slice(0,15)">
        <div class="f-label">{{ e.name }}</div>
        <div class="f-bar"><div class="f-fill" [style.width.%]="e.adjScore"></div></div>
        <div class="f-count"><span class="badge" [class.ok]="e.adjScore>=gate" [class.warn]="e.adjScore<gate">{{ e.adjScore }}</span></div>
      </div>
    </section>

    <!-- Contacts sub-tab -->
    <section class="card" *ngIf="sub==='contacts'">
      <h3>Contacts directory</h3>
      <table><thead><tr><th>Organization</th><th>Contact</th><th>Role</th><th>Email</th><th>Stage</th><th>Score</th></tr></thead>
        <tbody><tr *ngFor="let e of withContacts" (click)="sel=e">
          <td><b>{{ e.name }}</b></td><td>{{ contactParts(e)?.name || '—' }}</td>
          <td>{{ contactParts(e)?.role || '—' }}</td><td>{{ contactParts(e)?.email || '—' }}</td>
          <td>{{ e.stage }}</td><td>{{ e.score }}</td></tr></tbody></table>
      <p class="muted" *ngIf="!withContacts.length">No contacts on file.</p>
    </section>

    <div class="bulkbar" *ngIf="checkedCount">
      <b>{{ checkedCount }} selected</b>
      <select [(ngModel)]="bulkStage"><option value="">Move to stage…</option><option *ngFor="let st of studio.industry.stages" [value]="st">{{ st }}</option></select>
      <button class="btn" (click)="bulkMove()">Apply</button>
      <button class="btn" (click)="clearChecks()">Clear</button>
    </div>

    <aside class="dossier" *ngIf="sel">
      <div class="d-head"><h3>{{ sel.name }}</h3><button class="btn" (click)="sel=null">✕</button></div>
      <p class="muted">{{ sel.classification }} · score {{ sel.score }} · {{ sel.stage }}</p>
      <div class="d-acts">
        <button class="btn" (click)="openForm(sel)">Edit</button>
        <button class="btn" (click)="next(sel)">Advance stage →</button>
        <button class="btn danger" (click)="remove(sel)">Delete</button>
      </div>
      <h4>Evidence</h4>
      <div class="ev" *ngFor="let ev of evidence(sel)">
        <span [class.v]="ev.verified">{{ ev.verified ? '✓' : '○' }}</span> {{ ev.label }}
        <small class="muted">{{ ev.source }}</small>
        <button class="mini" (click)="verify(sel, ev)">{{ ev.verified ? 'Verified' : 'Verify' }}</button>
      </div>
      <h4>Contacts</h4><p class="muted">{{ contact(sel) || '—' }}</p>
    </aside>
  </div>`,
  styles: [`
    .ent{padding:16px;max-width:1200px;margin:0 auto;position:relative}
    .head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px}
    .filters{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
    .chip{padding:4px 10px;border-radius:14px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .chip.on{background:#3467d6;color:#fff;border-color:#3467d6}
    .btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn.danger{color:#c0392b;border-color:#f3c1c1}
    .muted{color:var(--muted,#888);font-size:12px}
    .dossier{position:fixed;right:0;top:0;bottom:0;width:340px;background:var(--card,#fff);border-left:1px solid var(--border,#eee);padding:16px;overflow:auto;box-shadow:-4px 0 16px rgba(0,0,0,.08);z-index:50}
    .d-head{display:flex;justify-content:space-between;align-items:center}h4{margin:14px 0 6px;font-size:13px}
    .d-acts{display:flex;gap:8px;margin:10px 0}
    .funnel{display:grid;grid-template-columns:140px 1fr 60px;gap:8px;align-items:center;padding:5px 0;font-size:13px}.f-label{color:var(--muted,#888);font-size:12px}.f-bar{height:8px;background:#eef1f8;border-radius:4px;overflow:hidden}.f-fill{height:100%;background:linear-gradient(90deg,#3467d6,#6ea8ff);border-radius:4px}.f-count{text-align:right}
    .bulkbar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 18px;border-radius:12px;display:flex;gap:10px;align-items:center;box-shadow:0 8px 30px rgba(0,0,0,.3);z-index:80}
    .bulkbar select{padding:6px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#fff}
    .bulkbar .btn{background:#334155;border-color:#475569;color:#fff}
    .ev{padding:6px 0;border-bottom:1px solid var(--border,#f5f5f5);font-size:13px}.ev .v{color:#1a9e5c}.ev small{display:block}.mini{font-size:11px;padding:2px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
  `]
})
export class EntitiesComponent implements OnInit {
  studio = inject(AiStudioService);
  popup = inject(PopupService);
  shared = inject(SharedService);
  classes = ['', 'Prospect', 'Customer', 'Candidate', 'Employer', 'Opportunity'];
  cls = ''; entities: StudioEntity[] = []; sel?: StudioEntity;
  page = 1; pageSize = 25; totalCount = 0; loading = false;

  gridOptions: any = {
    header: { title: 'Entities', desc: null, add: false, refresh: true, edit: true, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'classification', headerName: 'Class' },
      { field: 'score', headerName: 'Score' },
      { field: 'stage', headerName: 'Stage' },
      { field: 'source', headerName: 'Source' },
    ],
  };

  ngOnInit() {
    if (this.studio.pendingEntityId) { const id = this.studio.pendingEntityId; this.studio.pendingEntityId = undefined;
      this.studio.getEntity(id).subscribe(e => { if (e) this.sel = e; }); } this.load(); }
  load() {
    this.loading = true;
    this.studio.listEntitiesPaged(this.cls || undefined, this.page, this.pageSize).subscribe({
      next: p => { this.entities = p.items; this.totalCount = p.totalCount; this.loading = false; },
      error: () => this.loading = false,
    });
  }
  setCls(c: string) { this.cls = c; this.page = 1; this.load(); }
  onPage(e: { skip: number; take: number }) {
    this.pageSize = e.take; this.page = Math.floor(e.skip / e.take) + 1; this.load();
  }

  evidence(e: StudioEntity): Evidence[] { return this.studio.evidenceOf(e); }
  contact(e: StudioEntity) { try { const c = JSON.parse(e.contactJson || 'null'); return c ? `${c.name} · ${c.role} · ${c.email}` : ''; } catch { return ''; } }
  next(e: StudioEntity) {
    const stages = this.studio.industry.stages; const i = stages.indexOf(e.stage);
    this.studio.moveStage(e.id, stages[Math.min(i + 1, stages.length - 1)]).subscribe(() => this.load());
  }
  remove(e: StudioEntity) {
    if (!confirm(`Delete "${e.name}"?`)) return;
    this.studio.deleteEntity(e.id).subscribe(() => { this.sel = undefined; this.load(); });
  }
  verify(e: StudioEntity, ev: Evidence) {
    ev.verified = true;
    this.studio.updateEntity(e.id, { ...e, evidenceJson: JSON.stringify(this.evidence(e)) } as StudioEntity).subscribe(() => this.load());
  }

  sub: 'db' | 'score' | 'contacts' = 'db';
  bulkStage = '';
  get checkedCount() { return this.entities.filter(e => (e as any).isChecked).length; }
  clearChecks() { this.entities.forEach(e => (e as any).isChecked = false); }
  bulkMove() {
    if (!this.bulkStage) return;
    const ids = this.entities.filter(e => (e as any).isChecked).map(e => e.id);
    this.studio.bulkEntities(ids, this.bulkStage).subscribe(() => { this.clearChecks(); this.load(); });
  }
  gate = 80; weights: any = { signal: 30, capacity: 25, urgency: 25, reachability: 20 };
  get scoredEntities() {
    const w = this.weights; const total = (w.signal + w.capacity + w.urgency + w.reachability) || 1;
    return this.entities.map(e => ({ ...e, adjScore: Math.round(e.score * (0.7 + 0.3 * ((w.signal + w.capacity + w.urgency + w.reachability) / (4 * total))) ) }));
  }
  get withContacts() { return this.entities.filter(e => { try { return !!JSON.parse(e.contactJson || 'null'); } catch { return false; } }); }
  contactParts(e: StudioEntity): any { try { return JSON.parse(e.contactJson || 'null'); } catch { return null; } }
  saveScoring() { this.studio.putScoring(this.gate, this.weights).subscribe(); }
  exportCsv() {
    const rows = [['Name','Class','Score','Stage','Source'], ...this.entities.map(e => [e.name, e.classification, e.score, e.stage, e.source])];
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' })); a.download = 'entities.csv'; a.click();
  }

  openForm(e?: StudioEntity) {
    const isEdit = !!e;
    this.popup.showCustomPopup(StudioEntityCeComponent,
      { header: { text: isEdit ? 'Edit entity' : 'New entity' }, aside: 'modal-right', size: 'w-50' },
      { id: e?.id ?? null, data: e ?? {}, actionType: 'Show' })
      .then(() => this.load()).catch(() => this.load());
  }
}
