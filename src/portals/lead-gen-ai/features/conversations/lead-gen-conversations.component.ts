import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService, ClientBusiness, ConversationItem, InboundEnquiry
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { Router } from '@angular/router';

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

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    public readonly router: Router
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

  respond(e: InboundEnquiry): void {
    const summary = window.prompt('Response summary:');
    if (!summary) return;
    this.api.respondInboundEnquiry(this.clientBusinessId, e.id, summary).subscribe({
      next: () => { this.message = 'Response recorded.'; this.load(); },
      error: (err) => this.error = this.err(err)
    });
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
