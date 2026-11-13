import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, VoiceInteraction } from '../../../../services/lead-gen-api.service';

/** Voice call summary — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-voice-summary-popup',
  template: `
    <div class="fp">
      <label>Summary / transcript *<textarea [(ngModel)]="summary" name="summary" rows="3" placeholder="" required></textarea></label>
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
export class LeadGenVoiceSummaryPopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  interactionId = '';
  summary = '';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  submit(): void {
    if (!this.summary.trim()) { this.error = 'Summary is required.'; return; }
    this.saving = true; this.error = '';
    this.api.recordVoiceSummary(this.clientBusinessId, this.interactionId, this.summary.trim()).subscribe({
      next: (v) => { this.saving = false; this.onOk.emit(v); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'FAILED.'; }
    });
  }
}
