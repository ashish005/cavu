import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, Prospect, DiscoveryJob, DiscoveryExecution, DiscoverySource
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-prospecting',
  templateUrl: './lead-gen-prospecting.component.html',
  styleUrls: ['./lead-gen-prospecting.component.scss'],
  standalone: false
})
export class LeadGenProspectingComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  prospects: Prospect[] = [];
  jobs: DiscoveryJob[] = [];
  sources: DiscoverySource[] = [];
  lastExecution?: DiscoveryExecution;
  loading = false;
  error = '';
  message = '';
  search = '';
  tab: 'prospects' | 'discovery' = 'prospects';

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  get filteredProspects(): Prospect[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.prospects;
    return this.prospects.filter(p =>
      p.name.toLowerCase().includes(q) || (p.email ?? '').toLowerCase().includes(q) || (p.industry ?? '').toLowerCase().includes(q));
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
    this.loading = true;
    this.error = '';
    this.api.listProspects().subscribe({
      next: (r) => { this.prospects = r.items; },
      error: (e) => { this.error = this.err(e); }
    });
    this.api.listDiscoveryJobs(this.clientBusinessId || undefined).subscribe({
      next: (j) => { this.jobs = j; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.listDiscoverySources().subscribe({ next: (s) => this.sources = s, error: () => undefined });
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

  addProspect(): void {
    this.openPopup([
      { key: 'type', label: 'Type', type: 'select', required: true, options: [{ value: 'B2B', label: 'B2B' }, { value: 'B2C', label: 'B2C' }] },
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'website', label: 'Website' },
      { key: 'industry', label: 'Industry' }
    ], 'Add prospect', (v) => this.api.createProspect({
      type: v['type'] as 'B2B' | 'B2C', name: v['name'],
      email: v['email'] || undefined, phone: v['phone'] || undefined,
      website: v['website'] || undefined, industry: v['industry'] || undefined
    }), () => { this.message = 'Prospect added.'; this.load(); });
  }

  newJob(): void {
    this.openPopup([
      { key: 'name', label: 'Job name', required: true },
      { key: 'type', label: 'Type', required: true, placeholder: 'company-search' },
      { key: 'geography', label: 'Geography' },
      { key: 'industries', label: 'Industries (comma-separated)' },
      { key: 'keywords', label: 'Keywords (comma-separated)' }
    ], 'Create job', (v) => this.api.createDiscoveryJob({
      name: v['name'], type: v['type'], clientBusinessId: this.clientBusinessId || undefined,
      geography: v['geography'] || undefined,
      industries: v['industries'] ? v['industries'].split(',').map(s => s.trim()).filter(Boolean) : undefined,
      keywords: v['keywords'] ? v['keywords'].split(',').map(s => s.trim()).filter(Boolean) : undefined
    }), () => { this.message = 'Discovery job created.'; this.load(); });
  }

  runJob(j: DiscoveryJob): void {
    this.api.executeDiscoveryJob(j.id).subscribe({
      next: (e) => {
        this.lastExecution = e;
        this.message = `Execution finished: ${e.newResults} new, ${e.duplicateResults} duplicates, ${e.failedResults} failed.`;
        this.load();
      },
      error: (err) => this.error = this.err(err)
    });
  }

  toggleSource(s: DiscoverySource): void {
    this.api.setDiscoverySourceStatus(s.id, !s.isEnabled).subscribe({
      next: () => this.load(),
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
