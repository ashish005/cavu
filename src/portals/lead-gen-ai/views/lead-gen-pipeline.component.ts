import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Lead, LeadStage, ClientBusiness } from '../services/lead-gen-api.service';
import { WorkspaceContextService } from '../services/workspace-context.service';

@Component({
  selector: 'lead-gen-pipeline',
  templateUrl: './lead-gen-pipeline.component.html',
  styleUrls: ['./lead-gen-pipeline.component.scss'],
  standalone: false
})
export class LeadGenPipelineComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  leads: Lead[] = [];
  stages: LeadStage[] = [];
  loading = false;
  error = '';
  dragLeadId = '';

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService
  ) {}

  get businessName(): string {
    return this.clientBusinesses.find(b => b.id === this.clientBusinessId)?.name ?? 'Select a client business';
  }

  get activeLeads(): Lead[] {
    return this.leads.filter(l => l.status !== 'Archived');
  }

  leadsInStage(key: string): Lead[] {
    return this.activeLeads.filter(l => l.stageKey === key)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  stageTotal(key: string): number { return this.leadsInStage(key).length; }

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
    if (!this.clientBusinessId) return;
    this.loading = true;
    this.error = '';
    this.api.listLeads(this.clientBusinessId).subscribe({
      next: (leads) => { this.leads = leads; this.loading = false; },
      error: (e: HttpErrorResponse) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.listLeadStages(this.clientBusinessId).subscribe({ next: (s) => this.stages = s.sort((a, b) => a.sortOrder - b.sortOrder), error: () => undefined });
  }

  onDragStart(lead: Lead, ev: DragEvent): void {
    this.dragLeadId = lead.id;
    ev.dataTransfer?.setData('text/plain', lead.id);
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }

  onDrop(stageKey: string, ev: DragEvent): void {
    ev.preventDefault();
    const lead = this.leads.find(l => l.id === this.dragLeadId);
    this.dragLeadId = '';
    if (lead && lead.stageKey !== stageKey) this.moveStage(lead, stageKey);
  }

  allowDrop(ev: DragEvent): void { ev.preventDefault(); if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move'; }

  moveStage(lead: Lead, stageKey: string): void {
    if (!stageKey || lead.stageKey === stageKey) return;
    const prev = lead.stageKey;
    lead.stageKey = stageKey; // optimistic
    this.api.setLeadStage(this.clientBusinessId, lead.id, stageKey).subscribe({
      next: (u) => this.leads = this.leads.map(l => l.id === u.id ? u : l),
      error: (e: HttpErrorResponse) => { lead.stageKey = prev; this.error = this.err(e); }
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
