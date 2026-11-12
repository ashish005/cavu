import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService, ClientBusiness, ConversationItem, InboundEnquiry
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-conversations',
  templateUrl: './lead-gen-conversations.component.html',
  styleUrls: ['./lead-gen-conversations.component.scss'],
  standalone: false
})
export class LeadGenConversationsComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  conversations: ConversationItem[] = [];
  enquiries: InboundEnquiry[] = [];
  loading = false;
  error = '';
  message = '';
  kindFilter = '';
  tab: 'all' | 'enquiries' = 'all';
  selectedEnquiry?: InboundEnquiry;

  enquiryGridOptions: any = {
    header: { title: null as any, desc: null as any, add: false, refresh: false, edit: false, delete: false },
    total: 0,
    hasNext: false,
    hasPrevious: false,
    isOrderable: false,
    columnDefs: [
      { headerName: 'From', field: 'requesterName' },
      { headerName: 'Contact', field: 'contact' },
      { headerName: 'Message', field: 'message' },
      { headerName: 'Status', field: 'status' },
      { headerName: 'Received', field: 'received' }
    ]
  };

  get enquiryRows(): any[] {
    return this.enquiries.map(e => ({
      ...e,
      contact: e.requesterEmail || e.requesterPhone || '—',
      received: new Date(e.receivedAt).toLocaleString()
    }));
  }

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    public readonly router: Router,
    private readonly popupService: PopupService
  ) {}

  get kinds(): string[] { return [...new Set(this.conversations.map(c => c.kind))]; }

  get filtered(): ConversationItem[] {
    return this.kindFilter ? this.conversations.filter(c => c.kind === this.kindFilter) : this.conversations;
  }

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
    this.api.listConversations(cb).subscribe({ next: (c) => this.conversations = c, error: () => undefined });
    this.api.listInboundEnquiries(cb).subscribe({ next: (e) => { this.enquiries = e; this.loading = false; }, error: (e) => { this.error = this.err(e); this.loading = false; } });
  }

  selectEnquiry(row: any): void {
    this.selectedEnquiry = this.enquiries.find(e => e.id === row.id);
  }

  respond(e: InboundEnquiry): void {
    this.openPopup([{ key: 'summary', label: 'Response summary', type: 'textarea', required: true }],
      'Send response', (v) => this.api.respondInboundEnquiry(this.clientBusinessId, e.id, v['summary']),
      () => { this.message = 'Response recorded.'; this.load(); });
  }

  openPopup(fields: EntityFormField[], submitLabel: string, run: (v: Record<string, string>) => Observable<unknown>, onDone?: () => void): void {
    const parameters = {
      fields, submitLabel,
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        run(values).subscribe({
          next: () => { this.popupService.destroy(); onDone?.(); resolve(); },
          error: (err: HttpErrorResponse) => reject(new Error(this.err(err)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { size: 'W_50' }, parameters)
      .then(() => this.popupService.destroy(), () => this.popupService.destroy());
  }

  convert(e: InboundEnquiry): void {
    this.api.convertInboundEnquiry(this.clientBusinessId, e.id).subscribe({
      next: () => { this.message = 'Enquiry converted to lead.'; this.load(); },
      error: (err) => this.error = this.err(err)
    });
  }

  openLead(leadId?: string): void { if (leadId) this.router.navigate(['/leads', leadId]); }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
