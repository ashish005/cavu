import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService, ClientBusiness, SummaryReport, FunnelReport, AiUsageReport, Lead
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';

@Component({
  selector: 'lead-gen-analytics',
  templateUrl: './lead-gen-analytics.component.html',
  styleUrls: ['./lead-gen-analytics.component.scss'],
  standalone: false
})
export class LeadGenAnalyticsComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  summary?: SummaryReport;
  funnel?: FunnelReport;
  aiUsage?: AiUsageReport;
  leads: Lead[] = [];
  loading = false;
  error = '';

  constructor(private readonly api: LeadGenApiService, private readonly workspaceContext: WorkspaceContextService) {}

  get sourceBreakdown(): { source: string; count: number }[] {
    const map = new Map<string, number>();
    this.leads.forEach(l => map.set(l.source || 'Unknown', (map.get(l.source || 'Unknown') ?? 0) + 1));
    return [...map.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);
  }

  get maxSource(): number { return Math.max(1, ...this.sourceBreakdown.map(s => s.count)); }

  funnelRows = [
    { k: 'prospects' as const, l: 'Prospects' }, { k: 'qualified' as const, l: 'Qualified' },
    { k: 'ingested' as const, l: 'Ingested' }, { k: 'leads' as const, l: 'Leads' }, { k: 'won' as const, l: 'Won' }
  ];

  funnelPct(stage: 'prospects' | 'qualified' | 'ingested' | 'leads' | 'won'): number {
    if (!this.funnel || !this.funnel.prospects) return 0;
    return Math.round((this.funnel[stage] / this.funnel.prospects) * 100);
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
    this.summary = undefined; this.funnel = undefined; this.aiUsage = undefined;
    this.api.getSummaryReport(cb).subscribe({ next: (r) => this.summary = r, error: (e) => this.error = this.err(e) });
    this.api.getFunnelReport(cb).subscribe({ next: (r) => this.funnel = r, error: () => undefined });
    this.api.getAiUsageReport(cb).subscribe({ next: (r) => this.aiUsage = r, error: () => undefined });
    this.api.listLeads(cb).subscribe({ next: (l) => { this.leads = l; this.loading = false; }, error: (e) => { this.error = this.err(e); this.loading = false; } });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
