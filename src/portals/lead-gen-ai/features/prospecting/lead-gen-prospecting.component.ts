import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, Prospect, DiscoveryJob, DiscoveryExecution, DiscoverySource, IngestionPolicy, IngestionAttempt
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenDiscoveryJobPopupComponent } from '../shared/popups/entity/discovery-job-popup.component';
import { LeadGenProspectFormPopupComponent } from '../shared/popups/entity/prospect-form-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-gen-prospecting',
  templateUrl: './lead-gen-prospecting.component.html',
  styleUrls: ['./lead-gen-prospecting.component.scss'],
  standalone: false
})
export class LeadGenProspectingComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
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
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId, prospect: p };
    this.popupService.showCustomPopup(LeadGenProspectFormPopupComponent, { header: { text: 'Edit prospect' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
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

  addProspect(): void {
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId };
    this.popupService.showCustomPopup(LeadGenProspectFormPopupComponent, { header: { text: 'New prospect' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
  }

  newJob(): void {
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId };
    this.popupService.showCustomPopup(LeadGenDiscoveryJobPopupComponent, { header: { text: 'Form' }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
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
