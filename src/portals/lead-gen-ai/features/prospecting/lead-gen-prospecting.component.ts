import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, Prospect, DiscoveryJob, DiscoveryExecution, DiscoverySource, IngestionPolicy, IngestionAttempt
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-prospecting',
  templateUrl: './lead-gen-prospecting.component.html',
  styleUrls: ['./lead-gen-prospecting.component.scss'],
  standalone: false
})
export class LeadGenProspectingComponent implements OnInit {
  readonly perms = inject(LeadGenPermissionsService);
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
  tab: 'prospects' | 'discovery' | 'ingestion' = 'prospects';
  ingestionPolicy?: IngestionPolicy;
  ingestionMode = 'Manual';
  ingestionAttempts: IngestionAttempt[] = [];
  attemptGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Prospect', field: 'prospect' }, { headerName: 'Outcome', field: 'outcome' },
      { headerName: 'Reason', field: 'reason' }, { headerName: 'Lead', field: 'lead' },
      { headerName: 'Attempted', field: 'attempted' }
    ]
  };
  get attemptRows(): any[] {
    return this.ingestionAttempts.map(a => ({
      ...a, prospect: a.prospectId.slice(0, 8) + '…',
      lead: a.leadId ? a.leadId.slice(0, 8) + '…' : '—',
      attempted: new Date(a.attemptedAt).toLocaleString()
    }));
  }
  selectedJob?: DiscoveryJob;
  selectedProspect?: Prospect;

  prospectGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Name', field: 'name' }, { headerName: 'Type', field: 'type' },
      { headerName: 'Contact', field: 'contact' }, { headerName: 'Industry', field: 'industry' },
      { headerName: 'Source', field: 'source' }, { headerName: 'Added', field: 'added' }
    ]
  };
  jobGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Name', field: 'name' }, { headerName: 'Type', field: 'type' },
      { headerName: 'Active', field: 'active' }, { headerName: 'Created', field: 'created' }
    ]
  };

  get prospectRows(): any[] {
    return this.filteredProspects.map(p => ({
      ...p, contact: p.email || p.phone || '—', industry: p.industry || '—',
      added: new Date(p.createdAt).toLocaleDateString()
    }));
  }
  get jobRows(): any[] {
    return this.jobs.map(j => ({ ...j, active: j.isActive ? 'Yes' : 'No', created: new Date(j.createdAt).toLocaleDateString() }));
  }
  selectJobRow(row: any): void { this.selectedJob = this.jobs.find(j => j.id === row.id); }
  selectProspectRow(row: any): void { this.selectedProspect = this.prospects.find(p => p.id === row.id); }

  editProspect(p: Prospect): void {
    const parameters = {
      fields: [
        { key: 'name', label: 'Name', required: true },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website' },
        { key: 'industry', label: 'Industry' }
      ] as EntityFormField[],
      submitLabel: 'Save changes',
      initialValues: { name: p.name, email: p.email ?? '', phone: p.phone ?? '', website: p.website ?? '', industry: p.industry ?? '' },
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        this.api.updateProspect(p.id, {
          name: values['name'], email: values['email'] || undefined,
          phone: values['phone'] || undefined, website: values['website'] || undefined,
          industry: values['industry'] || undefined
        }).subscribe({
          next: (u) => {
            this.prospects = this.prospects.map(x => x.id === u.id ? u : x);
            this.popupService.destroy(); this.message = 'Prospect updated.'; resolve();
          },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { size: 'W_50' }, parameters)
      .then(() => this.popupService.destroy(), () => this.popupService.destroy());
  }

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
    this.loadIngestion();
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

  loadIngestion(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.getIngestionPolicy(cb).subscribe({
      next: (p) => { this.ingestionPolicy = p; this.ingestionMode = p.mode; },
      error: () => undefined
    });
    this.api.listIngestionAttempts(cb).subscribe({ next: (a) => this.ingestionAttempts = a, error: () => undefined });
  }

  saveIngestionPolicy(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.setIngestionPolicy(cb, this.ingestionMode).subscribe({
      next: (p) => { this.ingestionPolicy = p; this.message = 'Ingestion policy saved.'; },
      error: (e) => this.error = this.err(e)
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
