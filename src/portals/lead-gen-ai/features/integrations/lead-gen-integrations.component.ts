import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, IntegrationProvider, IntegrationConnection
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenConnectPopupComponent } from '../shared/popups/entity/integration-connect-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-gen-integrations',
  templateUrl: './lead-gen-integrations.component.html',
  styleUrls: ['./lead-gen-integrations.component.scss'],
  standalone: false
})
export class LeadGenIntegrationsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly perms = inject(LeadGenPermissionsService);
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  providers: IntegrationProvider[] = [];
  connections: IntegrationConnection[] = [];
  loading = false;
  error = '';
  message = '';
  selectedConnection?: IntegrationConnection;

  connectionGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Provider', field: 'provider' }, { headerName: 'Status', field: 'status' },
      { headerName: 'Last checked', field: 'checked' }, { headerName: 'Error', field: 'error' }
    ]
  };

  get connectionRows(): any[] {
    return this.connections.map(c => ({
      ...c, provider: this.providerName(c.providerId),
      checked: c.lastCheckedAt ? new Date(c.lastCheckedAt).toLocaleString() : '—',
      error: c.lastError || '—'
    }));
  }
  selectConnectionRow(row: any): void { this.selectedConnection = this.connections.find(c => c.id === row.id); }

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  providerName(id: string): string { return this.providers.find(p => p.id === id)?.displayName ?? id; }

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
    this.api.listIntegrationProviders().subscribe({ next: (p) => this.providers = p, error: () => undefined });
    this.api.listIntegrationConnections(cb).subscribe({
      next: (c) => { this.connections = c; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
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

  connect(): void {
    if (!this.clientBusinessId) return;
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId };
    this.popupService.showCustomPopup(LeadGenConnectPopupComponent, { header: { text: 'Form' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
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
