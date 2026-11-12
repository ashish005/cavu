import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Lead } from '../../../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-lead-form-popup',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="popup-form">
      <p class="popup-error" *ngIf="error">{{ error }}</p>
      <label>Type
        <select formControlName="type">
          <option value="Organization">Organization</option>
          <option value="Individual">Individual</option>
        </select>
      </label>
      <label>Name *<input formControlName="name" placeholder="Company or person name" /></label>
      <label>Email<input formControlName="email" type="email" placeholder="name@company.com" /></label>
      <label>Phone<input formControlName="phone" /></label>
      <label>Industry<input formControlName="industry" /></label>
      <div class="popup-actions">
        <button type="button" class="btn-secondary" (click)="parameters?.onCancel?.()">Cancel</button>
        <button type="submit" class="btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving…' : 'Create lead' }}</button>
      </div>
    </form>
  `,
  styles: [`
    .popup-form { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .popup-form label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 600; color: #475569; }
    .popup-form input, .popup-form select { padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }
    .popup-error { color: #dc2626; font-size: 13px; margin: 0; }
    .popup-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
    .btn-primary { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn-secondary { background: #fff; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 14px; font-size: 14px; cursor: pointer; }
  `],
  standalone: false
})
export class LeadGenLeadFormPopupComponent {
  @Input() parameters: any;
  saving = false;
  error = '';
  form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control('Organization'),
    name: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', Validators.email],
    phone: ['', Validators.maxLength(50)],
    industry: ['', Validators.maxLength(120)]
  });
  constructor(private readonly api: LeadGenApiService, private readonly fb: FormBuilder) {}
  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.saving = true;
    this.error = '';
    this.api.createLead(this.parameters.clientBusinessId, {
      type: v.type === 'Individual' ? 'Individual' : 'Organization',
      name: v.name, email: v.email || undefined, phone: v.phone || undefined, industry: v.industry || undefined
    }).subscribe({
      next: (lead: Lead) => this.parameters?.onCreated?.(lead),
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Could not create the lead.'; }
    });
  }
}
