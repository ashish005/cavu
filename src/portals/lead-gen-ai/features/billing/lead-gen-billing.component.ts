import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, SubscriptionPlan, Subscription, Entitlements
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-billing',
  templateUrl: './lead-gen-billing.component.html',
  styleUrls: ['./lead-gen-billing.component.scss'],
  standalone: false
})
export class LeadGenBillingComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  plans: SubscriptionPlan[] = [];
  subscriptions: Subscription[] = [];
  entitlements?: Entitlements;
  loading = false;
  error = '';
  message = '';

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  planName(id: string): string { return this.plans.find(p => p.id === id)?.displayName ?? id; }

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
    this.api.listSubscriptionPlans().subscribe({ next: (p) => this.plans = p, error: () => undefined });
    this.api.listSubscriptions().subscribe({
      next: (s) => { this.subscriptions = s; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
    this.api.getEntitlements().subscribe({ next: (e) => this.entitlements = e, error: () => undefined });
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

  subscribe(plan: SubscriptionPlan): void {
    this.openPopup([
      { key: 'scope', label: 'Scope', type: 'select', required: true,
        options: [{ value: 'organization', label: 'Organization' }, { value: 'client-business', label: 'Client business' }] }
    ], `Subscribe to ${plan.displayName}`, (v) => this.api.createSubscription(plan.id, v['scope'],
      v['scope'] === 'client-business' ? this.clientBusinessId || undefined : undefined),
      () => { this.message = 'Subscription created.'; this.load(); });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
