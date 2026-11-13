import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, WorkflowDefinition, WorkflowRun
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenWorkflowFormPopupComponent } from '../shared/popups/entity/workflow-form-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-gen-workflows',
  templateUrl: './lead-gen-workflows.component.html',
  styleUrls: ['./lead-gen-workflows.component.scss'],
  standalone: false
})
export class LeadGenWorkflowsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly perms = inject(LeadGenPermissionsService);
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  workflows: WorkflowDefinition[] = [];
  runs: WorkflowRun[] = [];
  selectedId = '';
  loading = false;
  error = '';
  message = '';

  runGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Trigger', field: 'trigger' }, { headerName: 'Status', field: 'status' },
      { headerName: 'Attempts', field: 'attempts' }, { headerName: 'Started', field: 'started' },
      { headerName: 'Error', field: 'error' }
    ]
  };

  get runRows(): any[] {
    return this.runs.map(r => ({
      ...r, trigger: r.triggerKind, attempts: r.attemptCount,
      started: new Date(r.startedAt).toLocaleString(), error: r.error || '—'
    }));
  }

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.workspaceContext.context$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
      const id = c?.clientBusinessId ?? '';
      if (id && id !== this.clientBusinessId) { this.clientBusinessId = id; this.load(); }
    });
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length) this.clientBusinessId = bs[0].id;
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  onBusinessChange(id: string): void { this.clientBusinessId = id; this.load(); }

  load(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.loading = true;
    this.error = '';
    this.api.listWorkflows(cb).subscribe({
      next: (w) => { this.workflows = w; this.loading = false; if (this.selectedId) this.select(this.workflows.find(x => x.id === this.selectedId) ?? null); },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
  }

  select(w: WorkflowDefinition | null): void {
    this.selectedId = w?.id ?? '';
    this.runs = [];
    if (!w) return;
    this.api.listWorkflowRuns(this.clientBusinessId, w.id).subscribe({ next: (r) => this.runs = r, error: () => undefined });
  }

  openPopup(fields: EntityFormField[], submitLabel: string, run: (v: Record<string, string>) => Observable<unknown>, onDone?: () => void): void {
    const parameters = {
      actionType: 'Show',
      fields, submitLabel,
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        run(values).subscribe({
          next: () => { this.popupService.destroy(); onDone?.(); resolve(); },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { header: { text: 'Form' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }

  create(): void {
    if (!this.clientBusinessId) return;
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId };
    this.popupService.showCustomPopup(LeadGenWorkflowFormPopupComponent, { header: { text: 'New workflow' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }

  runNow(w: WorkflowDefinition): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.triggerWorkflow(cb, w.id, 'manual').subscribe({
      next: () => { this.message = `Workflow "${w.name}" triggered.`; this.select(w); },
      error: (e) => this.error = this.err(e)
    });
  }

  // ---- visual designer ----
  designing = false;
  wfName = '';
  triggerType = 'lead.created';
  actionRows: { type: string; config: string }[] = [];
  conditionRows: { field: string; op: string; value: string }[] = [];

  readonly triggerOptions = ['lead.created', 'lead.updated', 'appointment.booked', 'campaign.completed', 'manual'];
  readonly actionOptions = ['send.email', 'send.sms', 'create.task', 'update.lead', 'book.appointment', 'notify.user', 'wait'];
  readonly conditionOps = ['equals', 'contains', 'greaterThan', 'lessThan', 'exists'];

  startDesign(): void { this.designing = true; this.wfName = ''; this.actionRows = [{ type: 'send.email', config: '{}' }]; this.conditionRows = []; }
  cancelDesign(): void { this.designing = false; }
  addAction(): void { this.actionRows.push({ type: 'send.email', config: '{}' }); }
  removeAction(i: number): void { this.actionRows.splice(i, 1); }
  addCondition(): void { this.conditionRows.push({ field: '', op: 'equals', value: '' }); }
  removeCondition(i: number): void { this.conditionRows.splice(i, 1); }

  saveDesign(): void {
    const cb = this.clientBusinessId;
    if (!cb || !this.wfName.trim()) { this.error = 'Workflow name is required.'; return; }
    const actionsJson = JSON.stringify({ steps: this.actionRows.map(a => ({ type: a.type, ...(this.safeJson(a.config)) })) });
    const conditionsJson = JSON.stringify({ rules: this.conditionRows.filter(c => c.field).map(c => ({ field: c.field, op: c.op, value: c.value })) });
    this.api.createWorkflow(cb, {
      name: this.wfName.trim(), triggerJson: JSON.stringify({ type: this.triggerType }),
      conditionsJson, actionsJson, isActive: true
    }).subscribe({
      next: () => { this.designing = false; this.message = 'Workflow created.'; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  private safeJson(s: string): any { try { return JSON.parse(s || '{}'); } catch { return {}; } }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }

  pages: Record<string, number> = {};
  pageSize = 10;
  pagedRows(rows: any[], key: string): any[] {
    const p = this.pages[key] || 1;
    return rows.slice((p - 1) * this.pageSize, p * this.pageSize);
  }
  onPage(key: string, e: any): void {
    this.pages[key] = Math.floor(e.skip / e.take) + 1;
  }
}
