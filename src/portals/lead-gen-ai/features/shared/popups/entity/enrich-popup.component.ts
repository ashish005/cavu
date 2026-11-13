import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, EnrichmentAttempt, EnrichRequest } from '../../../../services/lead-gen-api.service';

/** Prospect enrichment — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-enrich-popup',
  template: `
    <div class="fp">
      <label>Email<input [(ngModel)]="email" name="email" type="email" placeholder="" /></label>
      <label>Phone<input [(ngModel)]="phone" name="phone" type="text" placeholder="" /></label>
      <label>Website<input [(ngModel)]="website" name="website" type="text" placeholder="" /></label>
      <label>Industry<input [(ngModel)]="industry" name="industry" type="text" placeholder="" /></label>
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
export class LeadGenEnrichPopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  prospectId = '';
  email = '';
  phone = '';
  website = '';
  industry = '';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  submit(): void {
    if (!this.email && !this.phone && !this.website) { this.error = 'Provide at least one identifier.'; return; }
    this.saving = true; this.error = '';
    const req: EnrichRequest = { email: this.email || undefined, phone: this.phone || undefined, website: this.website || undefined, industry: this.industry || undefined, source: 'manual' };
    this.api.enrichProspect(this.clientBusinessId, this.prospectId, req).subscribe({
      next: (a) => { this.saving = false; this.onOk.emit(a); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Enrichment failed.'; }
    });
  }
}
