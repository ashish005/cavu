import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, SubscriptionPlan, Subscription, Entitlements
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { LeadGenPermissionsService } from '../../services/lead-gen-permissions.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';
import { LeadGenSubscriptionPopupComponent } from '../shared/popups/entity/subscription-popup.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lead-gen-billing',
  templateUrl: './lead-gen-billing.component.html',
  styleUrls: ['./lead-gen-billing.component.scss'],
  standalone: false
})
export class LeadGenBillingComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly perms = inject(LeadGenPermissionsService);
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  plans: SubscriptionPlan[] = [];
  subscriptions: Subscription[] = [];
  entitlements?: Entitlements;
  loading = false;
  error = '';
  message = '';

  subGridOptions: any = {
    header: { title: null, desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'Plan', field: 'plan' }, { headerName: 'Scope', field: 'scope' },
      { headerName: 'Status', field: 'status' }, { headerName: 'Period end', field: 'periodEnd' },
      { headerName: 'Created', field: 'created' }
    ]
  };

  get subRows(): any[] {
    return this.subscriptions.map(s => ({
      ...s, plan: this.planName(s.planId),
      periodEnd: s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : '—',
      created: new Date(s.createdAt).toLocaleDateString()
    }));
  }

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  planName(id: string): string { return this.plans.find(p => p.id === id)?.displayName ?? id; }

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
    this.api.listSubscriptionPlans().subscribe({ next: (p) => this.plans = p, error: () => undefined });
    this.api.listSubscriptions().subscribe({
      next: (s) => { this.subscriptions = s; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.getEntitlements().subscribe({ next: (e) => this.entitlements = e, error: () => undefined });
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

  subscribe(plan: SubscriptionPlan): void {
    const parameters = { actionType: 'Show', clientBusinessId: this.clientBusinessId, planId: plan.id };
    this.popupService.showCustomPopup(LeadGenSubscriptionPopupComponent, { header: { text: 'Subscribe — ' + plan.displayName }, aside: 'modal-right', size: 'w-50' }, parameters)
      .then(() => this.popupService.destroy(), () => { this.popupService.destroy(); this.load(); });
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
