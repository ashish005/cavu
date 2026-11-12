import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, AiAgent, AgentExecution
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-ai-agents',
  templateUrl: './lead-gen-ai-agents.component.html',
  styleUrls: ['./lead-gen-ai-agents.component.scss'],
  standalone: false
})
export class LeadGenAiAgentsComponent implements OnInit {
  readonly perms = inject(LeadGenPermissionsService);
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  agents: AiAgent[] = [];
  executions: AgentExecution[] = [];
  selectedId = '';
  running = false;
  loading = false;
  error = '';
  message = '';

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
    this.api.listAgents(cb).subscribe({
      next: (a) => { this.agents = a; this.loading = false; if (this.selectedId) this.select(this.agents.find(x => x.id === this.selectedId) ?? null); },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
  }

  select(a: AiAgent | null): void {
    this.selectedId = a?.id ?? '';
    this.executions = [];
    if (!a) return;
    this.api.listAgentExecutions(this.clientBusinessId, a.id).subscribe({ next: (x) => this.executions = x, error: () => undefined });
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
      { key: 'name', label: 'Agent name', required: true },
      { key: 'purpose', label: 'Purpose', required: true, placeholder: 'Qualify inbound leads' },
      { key: 'behaviourJson', label: 'Behaviour / system prompt (JSON)', type: 'textarea' }
    ], 'Create agent', (v) => this.api.createAgent(cb, {
      name: v['name'], purpose: v['purpose'],
      behaviourJson: v['behaviourJson'] || '{}',
      permissionsJson: '{"canSendEmail":false,"canUpdateLeads":false}'
    }), () => { this.message = 'Agent created.'; this.load(); });
  }

  addVersion(a: AiAgent): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'behaviourJson', label: 'Behaviour / system prompt (JSON)', type: 'textarea', required: true },
      { key: 'permissionsJson', label: 'Permissions JSON', type: 'textarea' }
    ], 'Add version', (v) => this.api.addAgentVersion(cb, a.id,
      v['behaviourJson'], v['permissionsJson'] || '{"canSendEmail":false,"canUpdateLeads":false}'),
      () => { this.message = 'New version added.'; });
  }

  run(a: AiAgent): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'kind', label: 'Kind', type: 'select', required: true,
        options: ['qualification', 'summary', 'classification', 'response', 'custom'].map(k => ({ value: k, label: k })) },
      { key: 'input', label: 'Input / prompt', type: 'textarea' }
    ], 'Run agent', (v) => this.api.runAgent(cb, a.id, v['kind'], v['input'] || undefined),
      () => { this.message = 'Execution complete — check history.'; this.select(a); });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
