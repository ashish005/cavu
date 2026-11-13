import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, BusinessProfile, BusinessProfileRequest } from '../../../../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-profile-popup',
  template: `
    <div class="fp">
      <label>Description<textarea [(ngModel)]="description" name="description" rows="3"></textarea></label>
      <label>Industry<input [(ngModel)]="industry" name="industry" type="text" placeholder="" /></label>
      <label>Category<input [(ngModel)]="category" name="category" type="text" placeholder="" /></label>
      <p class="fp-error" *ngIf="error">{{ error }}</p>
      <div class="fp-actions">
        <button type="button" class="fp-btn fp-secondary" (click)="onCancel.emit(null)">Cancel</button>
        <button type="button" class="fp-btn fp-primary" [disabled]="saving" (click)="submit()">{{ saving ? 'Saving…' : submitLabel }}</button>
      </div>
    </div>
  `,
  styles: [`.fp { padding: 8px 4px; display:flex; flex-direction:column; gap:12px; }
    .fp label { display:flex; flex-direction:column; gap:4px; font-size:13px; font-weight:600; color:#334155; }
    .fp input, .fp textarea { padding:9px 11px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-weight:400; }
    .fp-error { color:#b91c1c; font-size:13px; margin:0; }
    .fp-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:4px; }
    .fp-btn { border-radius:8px; padding:9px 18px; font-size:14px; font-weight:600; cursor:pointer; }
    .fp-primary { background:#2563eb; color:#fff; border:none; }
    .fp-primary:disabled { opacity:.6; }
    .fp-secondary { background:#fff; color:#334155; border:1px solid #cbd5e1; }`],
  standalone: false
})
export class LeadGenProfilePopupComponent {
  private readonly api = inject(LeadGenApiService);
  submitLabel = 'Save';
  profile?: BusinessProfile;
  clientBusinessId = '';
  description = '';
  industry = '';
  category = '';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    if (this.profile) { this.description = this.profile.description ?? ''; this.industry = this.profile.industry ?? ''; this.category = this.profile.category ?? ''; }
    this.submitLabel = 'Save profile';
  }

  submit(): void {
    this.saving = true; this.error = '';
    const req: BusinessProfileRequest = { description: this.description || undefined, industry: this.industry || undefined, category: this.category || undefined };
    this.api.updateBusinessProfile(this.clientBusinessId, req).subscribe({
      next: (p) => { this.saving = false; this.onOk.emit(p); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
