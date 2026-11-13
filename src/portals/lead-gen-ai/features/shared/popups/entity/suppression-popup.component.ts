import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, SuppressionEntry } from '../../../../services/lead-gen-api.service';

/** Add suppression — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-suppression-popup',
  template: `
    <div class="fp">
      <label>Contact key (email/phone) *<input [(ngModel)]="contactKey" name="contactKey" type="text" placeholder="" required /></label>
      <label>Reason *<input [(ngModel)]="reason" name="reason" type="text" placeholder="" required /></label>
      <label>Channel (optional)<input [(ngModel)]="channel" name="channel" type="text" placeholder="" /></label>
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
export class LeadGenSuppressionPopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  contactKey = '';
  reason = '';
  channel = '';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  submit(): void {
    if (!this.contactKey.trim() || !this.reason.trim()) { this.error = 'Contact key and reason are required.'; return; }
    this.saving = true; this.error = '';
    this.api.addSuppression(this.clientBusinessId, this.contactKey.trim(), this.reason.trim(), this.channel || undefined).subscribe({
      next: (s) => { this.saving = false; this.onOk.emit(s); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'FAILED.'; }
    });
  }
}
