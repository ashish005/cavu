import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, WorkflowDefinition, WorkflowRun
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-workflows',
  templateUrl: './lead-gen-workflows.component.html',
  styleUrls: ['./lead-gen-workflows.component.scss'],
  standalone: false
})
export class LeadGenWorkflowsComponent implements OnInit {
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
      fields, submitLabel,
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        run(values).subscribe({
          next: () => { this.popupService.destroy(); onDone?.(); resolve(); },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { size: 'W_50' }, parameters)
      .then(() => this.popupService.destroy(), () => this.popupService.destroy());
  }

  create(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'name', label: 'Workflow name', required: true },
      { key: 'triggerJson', label: 'Trigger JSON', placeholder: '{"type":"lead.created"}' },
      { key: 'conditionsJson', label: 'Conditions JSON', type: 'textarea' },
      { key: 'actionsJson', label: 'Actions JSON', type: 'textarea' }
    ], 'Create workflow', (v) => this.api.createWorkflow(cb, {
      name: v['name'], triggerJson: v['triggerJson'] || '{"type":"manual"}',
      conditionsJson: v['conditionsJson'] || '{}', actionsJson: v['actionsJson'] || '{}', isActive: true
    }), () => { this.message = 'Workflow created.'; this.load(); });
  }

  runNow(w: WorkflowDefinition): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.triggerWorkflow(cb, w.id, 'manual').subscribe({
      next: () => { this.message = `Workflow "${w.name}" triggered.`; this.select(w); },
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
