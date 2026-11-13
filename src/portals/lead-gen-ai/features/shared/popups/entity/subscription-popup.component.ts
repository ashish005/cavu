import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Subscription, SubscriptionPlan } from '../../../../services/lead-gen-api.service';

/** Subscription create form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-subscribe-popup',
  template: `
    <div class="fp">
            <label>Plan *<select [(ngModel)]="planId" name="planId"><option value="">—</option><option *ngFor="let p of plans" [value]="p.id">{{ p.displayName }} — {{ p.monthlyPrice }} {{ p.currency }}</option></select></label>
      <label>Scope<select [(ngModel)]="scope" name="scope"><option *ngFor="let o of scopeOptions" [value]="o.value">{{ o.label }}</option></select></label>
      <p class="fp-error" *ngIf="error">{{ error }}</p>
      <div class="fp-actions">
        <button type="button" class="fp-btn fp-secondary" (click)="onCancel.emit(null)">Cancel</button>
        <button type="button" class="fp-btn fp-primary" [disabled]="saving" (click)="submit()">{{ saving ? 'Saving…' : submitLabel }}</button>
      </div>
    </div>
  `,
  styles: [`.fp { padding: 8px 4px; display:flex; flex-direction:column; gap:12px; }
    .fp label { display:flex; flex-direction:column; gap:4px; font-size:13px; font-weight:600; color:#334155; }
    .fp input, .fp select, .fp textarea { padding:9px 11px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-weight:400; }
    .fp-error { color:#b91c1c; font-size:13px; margin:0; }
    .fp-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:4px; }
    .fp-btn { border-radius:8px; padding:9px 18px; font-size:14px; font-weight:600; cursor:pointer; }
    .fp-primary { background:#2563eb; color:#fff; border:none; }
    .fp-primary:disabled { opacity:.6; }
    .fp-secondary { background:#fff; color:#334155; border:1px solid #cbd5e1; }`],
  standalone: false
})
export class LeadGenSubscriptionPopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    planId = '';
  scope = 'organization';
  plans: SubscriptionPlan[] = [];
  scopeOptions = [{ value: 'organization', label: 'Organization' }, { value: 'client-business', label: 'Client business' }];
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.api.listSubscriptionPlans().subscribe({ next: (ps) => { this.plans = ps; this.planId = ps[0]?.id ?? ''; }, error: () => undefined });
  }
  submit(): void {
    if (!this.planId) { this.error = 'Plan is required.'; return; }
    this.saving = true; this.error = '';
    this.api.createSubscription(this.planId, this.scope, this.scope === 'client-business' ? this.clientBusinessId : undefined).subscribe({
      next: (s) => { this.saving = false; this.onOk.emit(s); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
