import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, Campaign, CampaignMessage, CampaignReport
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-campaigns',
  templateUrl: './lead-gen-campaigns.component.html',
  styleUrls: ['./lead-gen-campaigns.component.scss'],
  standalone: false
})
export class LeadGenCampaignsComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  campaigns: Campaign[] = [];
  messages: CampaignMessage[] = [];
  report?: CampaignReport;
  selectedId = '';
  loading = false;
  error = '';
  message = '';
  statusFilter = '';

  campaignGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Name', field: 'name' },
      { headerName: 'Channel', field: 'channel' },
      { headerName: 'Status', field: 'status' },
      { headerName: 'Scheduled', field: 'scheduled' }
    ]
  };
  messageGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Lead', field: 'lead' },
      { headerName: 'Status', field: 'status' },
      { headerName: 'Sent', field: 'sent' },
      { headerName: 'Response', field: 'response' }
    ]
  };

  get campaignRows(): any[] {
    return this.filtered.map(c => ({ ...c, scheduled: c.scheduledAt ? new Date(c.scheduledAt).toLocaleString() : '—' }));
  }
  get messageRows(): any[] {
    return this.messages.map(m => ({ ...m, lead: (m.leadId ?? '').slice(0, 8) + '…', sent: m.sentAt ? new Date(m.sentAt).toLocaleString() : '—', response: m.responseSummary || '—' }));
  }

  selectRow(row: any): void { this.select(row as Campaign); }

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  get filtered(): Campaign[] {
    return this.statusFilter ? this.campaigns.filter(c => c.status === this.statusFilter) : this.campaigns;
  }

  get selectedCampaign(): Campaign | null { return this.campaigns.find(c => c.id === this.selectedId) ?? null; }

  get statuses(): string[] { return [...new Set(this.campaigns.map(c => c.status))]; }

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
    this.api.listCampaigns(cb).subscribe({
      next: (c) => { this.campaigns = c; this.loading = false; if (this.selectedId) this.select(this.campaigns.find(x => x.id === this.selectedId) ?? null); },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
  }

  select(c: Campaign | null): void {
    this.selectedId = c?.id ?? '';
    this.messages = []; this.report = undefined;
    if (!c) return;
    const cb = this.clientBusinessId;
    this.api.listCampaignMessages(cb, c.id).subscribe({ next: (m) => this.messages = m, error: () => undefined });
    this.api.campaignReport(cb, c.id).subscribe({ next: (r) => this.report = r, error: () => undefined });
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
      { key: 'name', label: 'Campaign name', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'channel', label: 'Channel', type: 'select', required: true,
        options: ['Email', 'SMS', 'WhatsApp', 'Voice', 'Social'].map(c => ({ value: c, label: c })) }
    ], 'Create campaign', (v) => this.api.createCampaign(cb, {
      name: v['name'], description: v['description'] || undefined, channel: v['channel']
    }), () => { this.message = 'Campaign created.'; this.load(); });
  }

  act(c: Campaign, action: 'start' | 'pause' | 'cancel' | 'dispatch'): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    const calls = { start: this.api.startCampaign, pause: this.api.pauseCampaign, cancel: this.api.cancelCampaign, dispatch: this.api.dispatchCampaign };
    calls[action].call(this.api, cb, c.id).subscribe({
      next: () => { this.message = `Campaign ${action === 'dispatch' ? 'dispatched' : action + 'ed'}.`; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
