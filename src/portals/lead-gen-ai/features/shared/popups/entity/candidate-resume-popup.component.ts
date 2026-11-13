import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Resume, ResumeRequest } from '../../../../services/lead-gen-api.service';

/** Upload resume — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-candidate-resume-popup',
  template: `
    <div class="fp">
      <label>File name *<input [(ngModel)]="fileName" name="fileName" type="text" placeholder="" required /></label>
      <label>Storage reference *<input [(ngModel)]="storageReference" name="storageReference" type="text" placeholder="vault://resumes/…" required /></label>
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
export class LeadGenCandidateResumePopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  fileName = '';
  storageReference = '';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  submit(): void {
    if (!this.fileName.trim() || !this.storageReference.trim()) { this.error = 'File name and storage reference are required.'; return; }
    this.saving = true; this.error = '';
    const req: ResumeRequest = { fileName: this.fileName.trim(), storageReference: this.storageReference.trim() };
    this.api.createResume(req).subscribe({
      next: (r) => { this.saving = false; this.onOk.emit(r); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Upload failed.'; }
    });
  }
}
