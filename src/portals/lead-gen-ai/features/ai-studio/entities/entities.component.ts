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
    <div class="head">
      <h2>Entity Database</h2>
      <div class="filters">
        <button *ngFor="let c of classes" class="chip" [class.on]="cls===c" (click)="setCls(c)">{{ c || 'All' }}</button>
        <button class="btn primary" (click)="openForm()">+ New entity</button>
      </div>
    </div>

    <org-grid [data]="entities" [options]="gridOptions" [isLoading]="loading" (cb)="sel=$event"></org-grid>
    <org-grid-pagination [page]="page" [count]="totalCount" [perPage]="pageSize" [loading]="loading" (cb)="onPage($event)"></org-grid-pagination>

    <aside class="dossier" *ngIf="sel">
      <div class="d-head"><h3>{{ sel.name }}</h3><button class="btn" (click)="sel=null">✕</button></div>
      <p class="muted">{{ sel.classification }} · score {{ sel.score }} · {{ sel.stage }}</p>
      <div class="d-acts">
        <button class="btn" (click)="openForm(sel)">Edit</button>
        <button class="btn" (click)="next(sel)">Advance stage →</button>
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
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}
    .muted{color:var(--muted,#888);font-size:12px}
    .dossier{position:fixed;right:0;top:0;bottom:0;width:340px;background:var(--card,#fff);border-left:1px solid var(--border,#eee);padding:16px;overflow:auto;box-shadow:-4px 0 16px rgba(0,0,0,.08);z-index:50}
    .d-head{display:flex;justify-content:space-between;align-items:center}h4{margin:14px 0 6px;font-size:13px}
    .d-acts{display:flex;gap:8px;margin:10px 0}
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

  ngOnInit() { this.load(); }
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
  verify(e: StudioEntity, ev: Evidence) {
    ev.verified = true;
    this.studio.updateEntity(e.id, { ...e, evidenceJson: JSON.stringify(this.evidence(e)) } as StudioEntity).subscribe(() => this.load());
  }

  openForm(e?: StudioEntity) {
    const isEdit = !!e;
    this.popup.showCustomPopup(StudioEntityCeComponent,
      { header: { text: isEdit ? 'Edit entity' : 'New entity' }, aside: 'modal-right', size: 'w-50' },
      { id: e?.id ?? null, data: e ?? {}, actionType: 'Show' })
      .then(() => this.load()).catch(() => this.load());
  }
}
