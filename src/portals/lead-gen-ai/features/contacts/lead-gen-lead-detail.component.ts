import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService, Lead, LeadActivity, LeadStage, TimelineItem, ClientBusiness, ConversationItem
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { Observable } from 'rxjs';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';

@Component({
  selector: 'lead-gen-lead-detail',
  templateUrl: './lead-gen-lead-detail.component.html',
  styleUrls: ['./lead-gen-lead-detail.component.scss'],
  standalone: false
})
export class LeadGenLeadDetailComponent implements OnInit {
  readonly perms = inject(LeadGenPermissionsService);
  lead: Lead | null = null;
  stages: LeadStage[] = [];
  activities: LeadActivity[] = [];
  timeline: TimelineItem[] = [];
  conversations: ConversationItem[] = [];
  clientBusinesses: ClientBusiness[] = [];
  clientBusinessId = '';
  loading = true;
  error = '';
  noteKind = 'Note';
  noteText = '';
  noteSending = false;

  constructor(
    private readonly route: ActivatedRoute,
    public readonly router: Router,
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  get leadConversations(): ConversationItem[] {
    if (!this.lead) return [];
    const keys = [this.lead.email, this.lead.phone, this.lead.name, this.lead.email ?? ''].filter(Boolean).map(k => k!.toLowerCase());
    const info = (this.lead.email ?? '').toLowerCase();
    return this.conversations.filter(c =>
      c.leadId === this.lead!.id ||
      keys.includes((c.contact ?? '').toLowerCase()) ||
      (!!info && (c.contactInfo ?? '').toLowerCase().includes(info)));
  }

  get aiItems(): TimelineItem[] {
    return this.timeline.filter(t => ['voice', 'agent', 'ai'].includes(t.kind.toLowerCase()));
  }

  get nextAction(): string {
    if (!this.lead) return '';
    if (this.lead.status === 'Won') return 'Lead won — schedule onboarding or hand off to delivery.';
    if (!this.lead.email && !this.lead.phone) return 'Add contact details to enable outreach.';
    if (this.leadConversations.length === 0) return 'No conversations yet — start outreach via campaign or call.';
    const last = this.timeline[0];
    if (last && (Date.now() - new Date(last.at).getTime()) > 3 * 86400000) return 'No recent activity — schedule a follow-up.';
    return 'Review latest activity and qualify or book next step.';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length) this.clientBusinessId = bs[0].id;
        this.load(id);
      },
      error: () => this.load(id)
    });
  }

  load(id: string): void {
    if (!this.clientBusinessId) { this.loading = false; return; }
    this.api.listLeads(this.clientBusinessId).subscribe({
      next: (leads) => {
        this.lead = leads.find(l => l.id === id) ?? null;
        if (!this.lead) { this.error = 'Lead not found.'; this.loading = false; return; }
        this.api.listLeadStages(this.clientBusinessId).subscribe({ next: (s) => this.stages = s.sort((a, b) => a.sortOrder - b.sortOrder), error: () => undefined });
        this.api.listLeadActivities(this.clientBusinessId, id).subscribe({ next: (a) => this.activities = a, error: () => undefined });
        this.api.getLeadTimeline(this.clientBusinessId, id).subscribe({ next: (t) => this.timeline = t, error: () => undefined });
        this.api.listConversations(this.clientBusinessId).subscribe({ next: (c) => this.conversations = c, error: () => undefined });
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => { this.error = this.err(e); this.loading = false; }
    });
  }

  moveStage(key: string): void {
    if (!this.lead || !key) return;
    const prev = this.lead.stageKey;
    this.lead.stageKey = key;
    this.api.setLeadStage(this.clientBusinessId, this.lead.id, key).subscribe({
      next: (u) => { this.lead = u; },
      error: (e: HttpErrorResponse) => { if (this.lead) this.lead.stageKey = prev; this.error = this.err(e); }
    });
  }

  editLead(): void {
    if (!this.lead) return;
    const l = this.lead;
    const parameters = {
      fields: [
        { key: 'name', label: 'Name', required: true },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website' },
        { key: 'industry', label: 'Industry' },
        { key: 'source', label: 'Source' }
      ] as EntityFormField[],
      submitLabel: 'Save changes',
      initialValues: { name: l.name, email: l.email ?? '', phone: l.phone ?? '', website: l.website ?? '', industry: l.industry ?? '', source: l.source },
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        this.api.updateLead(this.clientBusinessId, l.id, {
          type: l.type, name: values['name'],
          email: values['email'] || undefined, phone: values['phone'] || undefined,
          website: values['website'] || undefined, industry: values['industry'] || undefined,
          source: values['source'] || l.source
        }).subscribe({
          next: (u) => { this.lead = u; this.popupService.destroy(); resolve(); },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { size: 'W_50' }, parameters)
      .then(() => this.popupService.destroy(), () => this.popupService.destroy());
  }

  archiveLead(): void {
    if (!this.lead) return;
    if (!confirm(`Archive "${this.lead.name}"? It will be hidden from active lists.`)) return;
    this.api.archiveLead(this.clientBusinessId, this.lead.id).subscribe({
      next: () => this.router.navigate(['/leads']),
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  addNote(): void {
    if (!this.lead || !this.noteText.trim()) return;
    this.noteSending = true;
    this.api.addLeadActivity(this.clientBusinessId, this.lead.id, this.noteKind, this.noteText.trim()).subscribe({
      next: (a) => { this.activities = [a, ...this.activities]; this.noteText = ''; this.noteSending = false; this.api.getLeadTimeline(this.clientBusinessId, this.lead!.id).subscribe({ next: (t) => this.timeline = t, error: () => undefined }); },
      error: (e: HttpErrorResponse) => { this.noteSending = false; this.error = this.err(e); }
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
