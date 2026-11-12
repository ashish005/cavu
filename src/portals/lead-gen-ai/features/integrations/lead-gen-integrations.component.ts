import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, IntegrationProvider, IntegrationConnection
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-integrations',
  templateUrl: './lead-gen-integrations.component.html',
  styleUrls: ['./lead-gen-integrations.component.scss'],
  standalone: false
})
export class LeadGenIntegrationsComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  providers: IntegrationProvider[] = [];
  connections: IntegrationConnection[] = [];
  loading = false;
  error = '';
  message = '';

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  providerName(id: string): string { return this.providers.find(p => p.id === id)?.displayName ?? id; }

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
    this.api.listIntegrationProviders().subscribe({ next: (p) => this.providers = p, error: () => undefined });
    this.api.listIntegrationConnections(cb).subscribe({
      next: (c) => { this.connections = c; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
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

  connect(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'providerId', label: 'Provider', type: 'select', required: true,
        options: this.providers.map(p => ({ value: p.id, label: p.displayName })) },
      { key: 'credentialReference', label: 'Credential reference', placeholder: 'vault://…' },
      { key: 'settingsJson', label: 'Settings JSON', type: 'textarea' }
    ], 'Connect', (v) => this.api.createIntegrationConnection(cb, {
      providerId: v['providerId'], credentialReference: v['credentialReference'] || undefined,
      settingsJson: v['settingsJson'] || undefined
    }), () => { this.message = 'Connection created.'; this.load(); });
  }

  check(c: IntegrationConnection): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.checkIntegrationConnection(cb, c.id).subscribe({
      next: (u) => {
        this.connections = this.connections.map(x => x.id === u.id ? u : x);
        this.message = u.status === 'Healthy' || u.status === 'Connected' ? 'Connection healthy.' : `Status: ${u.status}`;
      },
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
