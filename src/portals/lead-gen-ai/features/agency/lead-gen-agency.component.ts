import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LeadGenApiService, ClientBusiness, OrgMember, Subscription, SubscriptionPlan,
  AuditEntry, SummaryReport, ClientBusinessReport
} from '../../services/lead-gen-api.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';

@Component({
  selector: 'lead-gen-agency',
  templateUrl: './lead-gen-agency.component.html',
  styleUrls: ['./lead-gen-agency.component.scss'],
  standalone: false
})
export class LeadGenAgencyComponent implements OnInit {
  readonly perms = inject(LeadGenPermissionsService);
  businesses: ClientBusiness[] = [];
  members: OrgMember[] = [];
  subscriptions: Subscription[] = [];
  plans: SubscriptionPlan[] = [];
  audit: AuditEntry[] = [];
  summary?: SummaryReport;
  reports: Record<string, ClientBusinessReport> = {};
  loading = false;
  error = '';

  businessGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Business', field: 'name' }, { headerName: 'Status', field: 'status' },
      { headerName: 'Slug', field: 'slug' }, { headerName: 'Created', field: 'created' }
    ]
  };
  auditGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'When', field: 'when' }, { headerName: 'Actor', field: 'actor' },
      { headerName: 'Entity', field: 'entity' }, { headerName: 'Action', field: 'action' }
    ]
  };

  get businessRows(): any[] {
    return this.businesses.map(b => ({ ...b, created: new Date(b.createdAt).toLocaleDateString() }));
  }
  get auditRows(): any[] {
    return this.audit.slice(0, 50).map(a => ({
      ...a, when: new Date(a.occurredAt).toLocaleString(),
      actor: a.actorUserId?.slice(0, 8) || 'system',
      entity: a.entityType
    }));
  }
  get activeBusinesses(): number { return this.businesses.filter(b => b.status === 'Active').length; }
  get totalMembers(): number { return this.members.filter(m => m.isActive).length; }
  get activeSubscriptions(): number { return this.subscriptions.filter(s => s.status === 'Active').length; }

  constructor(private readonly api: LeadGenApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.businesses = bs;
        bs.slice(0, 10).forEach(b => {
          this.api.getClientBusinessReport(b.id).subscribe({
            next: (r) => this.reports[b.id] = r, error: () => undefined
          });
        });
      },
      error: (e: HttpErrorResponse) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.listOrganizationMembers().subscribe({ next: (m) => this.members = m, error: () => undefined });
    this.api.listSubscriptions().subscribe({ next: (s) => this.subscriptions = s, error: () => undefined });
    this.api.listSubscriptionPlans().subscribe({ next: (p) => this.plans = p, error: () => undefined });
    this.api.listAuditEvents({ take: 50 }).subscribe({ next: (a) => { this.audit = a; this.loading = false; }, error: () => { this.loading = false; } });
    this.api.getSummaryReport().subscribe({ next: (s) => this.summary = s, error: () => undefined });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
