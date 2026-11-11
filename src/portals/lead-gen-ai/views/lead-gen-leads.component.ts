import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService, Lead, LeadStage, LeadActivity, ClientBusiness, TimelineItem
} from '../services/lead-gen-api.service';
import { WorkspaceContextService } from '../services/workspace-context.service';

@Component({
  selector: 'lead-gen-leads',
  templateUrl: './lead-gen-leads.component.html',
  styleUrls: ['./lead-gen-leads.component.scss'],
  standalone: false
})
export class LeadGenLeadsComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  leads: Lead[] = [];
  stages: LeadStage[] = [];
  loading = false;
  error = '';
  message = '';
  search = '';
  stageFilter = '';
  showForm = false;
  view: 'list' | 'board' = 'list';
  seeding = false;
  activities: Record<string, LeadActivity[]> = {};
  timelines: Record<string, TimelineItem[]> = {};
  expandedLeadId = '';

  readonly leadForm = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control('Organization'),
    name: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', Validators.email],
    phone: ['', Validators.maxLength(50)],
    industry: ['', Validators.maxLength(120)]
  });
  readonly activityForm = this.fb.nonNullable.group({
    kind: this.fb.nonNullable.control('Note'),
    summary: ['', [Validators.required, Validators.maxLength(2000)]]
  });

  constructor(
    private readonly api: LeadGenApiService,
    private readonly fb: FormBuilder,
    private readonly workspaceContext: WorkspaceContextService
  ) {}

  get businessName(): string {
    return this.clientBusinesses.find(b => b.id === this.clientBusinessId)?.name ?? 'Select a client business';
  }

  get filteredLeads(): Lead[] {
    const q = this.search.trim().toLowerCase();
    return this.leads.filter(l => {
      if (this.stageFilter === '__won__') { if (l.status !== 'Qualified') return false; }
      else if (this.stageFilter && l.stageKey !== this.stageFilter) return false;
      if (q && !(l.name.toLowerCase().includes(q) || (l.email ?? '').toLowerCase().includes(q) || (l.phone ?? '').includes(q))) return false;
      return true;
    });
  }

  get stageCounts(): { key: string; label: string; count: number; won: boolean; lost: boolean }[] {
    return this.stages.map(s => ({
      key: s.key, label: s.label, won: s.isWon, lost: s.isLost,
      count: this.leads.filter(l => l.stageKey === s.key && l.status !== 'Archived').length
    }));
  }

  get activeCount(): number { return this.leads.filter(l => l.status !== 'Archived').length; }
  get wonCount(): number { return this.leads.filter(l => l.status === 'Qualified').length; }
  get archivedCount(): number { return this.leads.filter(l => l.status === 'Archived').length; }

  ngOnInit(): void {
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length > 0) this.clientBusinessId = bs[0].id;
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  onBusinessChange(id: string): void {
    this.clientBusinessId = id;
    this.load();
  }

  load(): void {
    if (!this.clientBusinessId) return;
    this.loading = true;
    this.error = '';
    this.api.listLeads(this.clientBusinessId).subscribe({
      next: (leads) => { this.leads = leads; this.loading = false; },
      error: (e: HttpErrorResponse) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.listLeadStages(this.clientBusinessId).subscribe({ next: (s) => this.stages = s, error: () => undefined });
  }

  stageLabel(key: string): string {
    return this.stages.find(s => s.key === key)?.label ?? key;
  }

  moveStage(lead: Lead, stageKey: string): void {
    if (!stageKey || stageKey === lead.stageKey) return;
    this.api.setLeadStage(this.clientBusinessId, lead.id, stageKey).subscribe({
      next: (updated) => this.leads = this.leads.map(l => l.id === updated.id ? updated : l),
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  archive(lead: Lead): void {
    this.api.archiveLead(this.clientBusinessId, lead.id).subscribe({
      next: (u) => this.leads = this.leads.map(l => l.id === u.id ? u : l),
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  restore(lead: Lead): void {
    this.api.restoreLead(this.clientBusinessId, lead.id).subscribe({
      next: (u) => this.leads = this.leads.map(l => l.id === u.id ? u : l),
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  convert(lead: Lead): void {
    this.api.convertLead(this.clientBusinessId, lead.id).subscribe({
      next: (u) => { this.leads = this.leads.map(l => l.id === u.id ? u : l); this.message = `${lead.name} converted.`; },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  toggleActivities(lead: Lead): void {
    if (this.expandedLeadId === lead.id) { this.expandedLeadId = ''; return; }
    this.expandedLeadId = lead.id;
    if (!this.activities[lead.id]) {
      this.api.listLeadActivities(this.clientBusinessId, lead.id).subscribe({
        next: (a) => this.activities[lead.id] = a,
        error: () => undefined
      });
      this.api.getLeadTimeline(this.clientBusinessId, lead.id).subscribe({
        next: (items) => this.timelines[lead.id] = items,
        error: () => undefined
      });
    }
  }

  addActivity(lead: Lead): void {
    if (this.activityForm.invalid) return;
    const v = this.activityForm.getRawValue();
    this.api.addLeadActivity(this.clientBusinessId, lead.id, v.kind, v.summary).subscribe({
      next: (a) => {
        this.activities[lead.id] = [a, ...(this.activities[lead.id] ?? [])];
        this.activityForm.reset({ kind: 'Note', summary: '' });
        this.message = 'Activity logged.';
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  seedDemo(): void {
    if (this.seeding) return;
    if (!this.clientBusinessId) {
      this.error = 'Select a client business first.';
      return;
    }
    this.seeding = true;
    this.error = '';
    this.api.seedDemoData(this.clientBusinessId).subscribe({
      next: (r) => { this.seeding = false; this.message = `Demo data loaded (${r.recordsCreated} records).`; this.load(); },
      error: (e: HttpErrorResponse) => { this.seeding = false; this.error = this.err(e); }
    });
  }

  createLead(): void {
    if (this.leadForm.invalid) return;
    const v = this.leadForm.getRawValue();
    this.api.createLead(this.clientBusinessId, {
      type: v.type === 'Individual' ? 'Individual' : 'Organization',
      name: v.name, email: v.email || undefined, phone: v.phone || undefined, industry: v.industry || undefined
    }).subscribe({
      next: (lead) => {
        this.leads = [lead, ...this.leads];
        this.leadForm.reset({ type: 'Organization', name: '', email: '', phone: '', industry: '' });
        this.showForm = false;
        this.message = 'Lead created.';
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
