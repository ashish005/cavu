import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, StudioEntity, Appt } from '../ai-studio.service';
import { TableComponent, PaginationComponent } from '@app-global';
import { StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

type Tab = 'pipeline' | 'schedule';

/** Route 4 — Pipelines & Schedule: kanban stage board + appointments. */
@Component({
  selector: 'app-pipelines',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, PaginationComponent, StudioRowActionsCell, StudioBadgeCellComponent],
  template: `
  <div>
    <div class="page-head">
      <div><h1>Pipelines &amp; Schedule</h1><p class="sub">{{ studio.workspace?.label }} · {{ studio.industry?.label }}</p></div>
      <div class="tabs">
        <button class="chip" [class.on]="tab==='pipeline'" (click)="tab='pipeline'">Stage Pipeline</button>
        <button class="chip" [class.on]="tab==='schedule'" (click)="tab='schedule'">Scheduling</button>
      </div>
    </div>

    <!-- 4A Kanban -->
    <div class="board" *ngIf="tab==='pipeline'">
      <div class="col" *ngFor="let st of stages">
        <div class="col-head">{{ st }} <span class="cnt">{{ count(st) }}</span></div>
        <div class="card ent-card" *ngFor="let e of inStage(st)" (click)="sel=e">
          <b>{{ e.name }}</b>
          <div class="meta">{{ e.classification }} · {{ e.source }}</div>
          <div class="foot"><span class="score" [class.q]="e.score>=80">{{ e.score }}/100</span>
            <button class="mini" (click)="$event.stopPropagation();next(e)">→ {{ nextStage(e) }}</button></div>
        </div>
        <p class="muted empty" *ngIf="!inStage(st).length">—</p>
      </div>
    </div>

    <!-- 4B Scheduling -->
    <section class="card" *ngIf="tab==='schedule'">
      <h3>Upcoming appointments <span class="muted">{{ apptTotal || appts.length }} total</span></h3>
      <org-grid [data]="appts" [options]="apptGrid" [isLoading]="apptLoading"></org-grid>
      <org-grid-pagination [page]="apptPage" [count]="apptTotal" [perPage]="apptPageSize" [loading]="apptLoading" (cb)="onApptPage($event)"></org-grid-pagination>
      <p class="muted" *ngIf="!appts.length">No appointments booked yet.</p>
    </section>
  </div>`,
  styles: [`
    .tabs{display:flex;gap:6px}.board{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(200px,1fr);gap:12px;overflow-x:auto;padding-bottom:8px}
    .col{background:#eef1f8;border-radius:12px;padding:10px;min-height:200px}
    .col-head{font-size:12px;font-weight:700;text-transform:uppercase;color:var(--st-muted,#6b7690);padding:4px 6px 10px;display:flex;justify-content:space-between}
    .cnt{background:#fff;border-radius:10px;padding:0 8px;font-size:11px}
    .ent-card{padding:10px;margin-bottom:8px;cursor:pointer}.ent-card:hover{border-color:#3467d6}
    .meta{font-size:11px;color:var(--st-muted,#6b7690);margin:4px 0}.foot{display:flex;justify-content:space-between;align-items:center}
    .score{font-size:11px;font-weight:700}.score.q{color:#1a9e5c}.empty{padding:12px;text-align:center}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:8px;border-bottom:1px solid var(--st-border,#e6e9f2);text-align:left}
  `]
})
export class PipelinesComponent implements OnInit {
  studio = inject(AiStudioService);
  tab: Tab = 'pipeline';
  entities: StudioEntity[] = []; appts: Appt[] = [];
  sel?: StudioEntity;
  apptPage = 1; apptPageSize = 25; apptTotal = 0; apptLoading = false;
  apptGrid: any = {
    header: { title: 'Upcoming appointments', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'startUtc', headerName: 'When', cellFn: (a: Appt) => new Date(a.startUtc).toLocaleString() },
      { field: 'notes', headerName: 'Title / Entity', cellFn: (a: Appt) => a.notes || 'Appointment' },
      { field: 'channel', headerName: 'Channel', cellFn: (a: Appt) => this.channelOf(a) },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v === 'confirmed' ? 'ok' : v === 'scheduled' ? 'warn' : '' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [{ label: 'Confirm', when: (a: Appt) => a.status !== 'confirmed', run: (a: Appt) => this.confirm(a) }] },
    ],
  };

  get stages() { return this.studio.industry?.stages ?? []; }
  ngOnInit() {
    this.studio.entities$.subscribe(e => this.entities = e);
    this.studio.listEntitiesPaged(undefined, 1, 300).subscribe({ error: () => {} });
    this.loadAppts();
  }
  loadAppts() {
    this.apptLoading = true;
    this.studio.listAppointments(this.apptPage, this.apptPageSize).subscribe({
      next: p => { this.appts = p.items; this.apptTotal = p.totalCount; this.apptLoading = false; },
      error: () => this.apptLoading = false,
    });
  }
  onApptPage(e: { skip: number; take: number }) {
    this.apptPageSize = e.take; this.apptPage = Math.floor(e.skip / e.take) + 1; this.loadAppts();
  }
  inStage(s: string) { return this.entities.filter(e => e.stage === s); }
  count(s: string) { return this.inStage(s).length; }
  nextStage(e: StudioEntity) { const i = this.stages.indexOf(e.stage); return this.stages[Math.min(i + 1, this.stages.length - 1)]; }
  next(e: StudioEntity) { this.studio.moveStage(e.id, this.nextStage(e)).subscribe(() => this.studio.refreshAll()); }
  entityName(id?: string) { return this.entities.find(e => e.id === id)?.name ?? ''; }
  channelOf(a: Appt) { return (a.notes ?? '').includes('video') ? 'Video Meet' : (a.notes ?? '').includes('phone') ? 'Phone Briefing' : 'Session'; }
  confirm(a: Appt) { this.studio.confirmAppointment(a.id).subscribe(() => this.loadAppts()); }
}
