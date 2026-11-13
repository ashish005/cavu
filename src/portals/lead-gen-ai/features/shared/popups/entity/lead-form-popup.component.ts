import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Lead, LeadRequest } from '../../../../services/lead-gen-api.service';

/** Lead create/edit form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-lead-form-popup-x',
  template: `
    <div class="fp">
            <label>Type<select [(ngModel)]="type" name="type"><option *ngFor="let o of typeOptions" [value]="o.value">{{ o.label }}</option></select></label>
      <label>Name *<input [(ngModel)]="name" name="name" required /></label>
      <label>Email<input [(ngModel)]="email" name="email" type="email" /></label>
      <label>Phone<input [(ngModel)]="phone" name="phone" /></label>
      <label>Website<input [(ngModel)]="website" name="website" /></label>
      <label>Industry<input [(ngModel)]="industry" name="industry" /></label>
      <label *ngIf="!lead">Source<input [(ngModel)]="source" name="source" placeholder="e.g. Website, Referral" /></label>
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
export class LeadGenLeadEntityPopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    lead?: Lead;
  type = 'Organization';
  name = '';
  email = '';
  phone = '';
  website = '';
  industry = '';
  source = '';
  typeOptions = [{ value: 'Individual', label: 'Individual' }, { value: 'Organization', label: 'Organization' }];
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    const l = this.lead;
    if (l) { this.type = l.type; this.name = l.name; this.email = l.email ?? ''; this.phone = l.phone ?? ''; this.website = l.website ?? ''; this.industry = l.industry ?? ''; this.source = l.source; this.submitLabel = 'Save changes'; }
  }

  submit(): void {
    if (!this.name.trim()) { this.error = 'Name is required.'; return; }
    this.saving = true; this.error = '';
    const req: LeadRequest = { type: this.type, name: this.name.trim(), email: this.email || undefined, phone: this.phone || undefined, website: this.website || undefined, industry: this.industry || undefined, source: this.source || undefined };
    const call = this.lead ? this.api.updateLead(this.clientBusinessId, this.lead.id, req) : this.api.createLead(this.clientBusinessId, req);
    call.subscribe({
      next: (lead) => { this.saving = false; this.onOk.emit(lead); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
