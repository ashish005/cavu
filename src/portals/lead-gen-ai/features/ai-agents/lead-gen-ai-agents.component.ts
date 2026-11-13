import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, AiAgent, AgentExecution
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenAgentRunPopupComponent } from '../shared/popups/entity/agent-run-popup.component';
import { LeadGenAgentVersionPopupComponent } from '../shared/popups/entity/agent-version-popup.component';
import { LeadGenAgentFormPopupComponent } from '../shared/popups/entity/agent-form-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-gen-ai-agents',
  templateUrl: './lead-gen-ai-agents.component.html',
  styleUrls: ['./lead-gen-ai-agents.component.scss'],
  standalone: false
})
export class LeadGenAiAgentsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
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
    this.popupService.showCustomPopup(LeadGenAgentFormPopupComponent, { header: { text: 'New agent' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }

  addVersion(a: AiAgent): void {
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId, agentId: a.id };
    this.popupService.showCustomPopup(LeadGenAgentVersionPopupComponent, { header: { text: 'New version' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }


  run(a: AiAgent): void {
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId, agentId: a.id, agentName: a.name };
    this.popupService.showCustomPopup(LeadGenAgentRunPopupComponent, { header: { text: 'Run agent' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }


  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
