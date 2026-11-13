import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Prospect, UpdateProspectRequest, CreateProspectRequest, ProspectType } from '../../../../services/lead-gen-api.service';

/** Prospect create/edit form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-prospect-form-popup',
  template: `
    <div class="fp">
            <label>Type<select [(ngModel)]="type" name="type" [disabled]="!!prospect"><option *ngFor="let o of typeOptions" [value]="o.value">{{ o.label }}</option></select></label>
      <label>Name *<input [(ngModel)]="name" name="name" required /></label>
      <label>Email<input [(ngModel)]="email" name="email" type="email" /></label>
      <label>Phone<input [(ngModel)]="phone" name="phone" /></label>
      <label>Website<input [(ngModel)]="website" name="website" /></label>
      <label>Industry<input [(ngModel)]="industry" name="industry" /></label>
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
export class LeadGenProspectFormPopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    prospect?: Prospect;
  type: ProspectType = 'B2B';
  name = '';
  email = '';
  phone = '';
  website = '';
  industry = '';
  typeOptions = [{ value: 'B2B', label: 'B2B' }, { value: 'B2C', label: 'B2C' }];
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    const p = this.prospect;
    if (p) { this.type = p.type; this.name = p.name; this.email = p.email ?? ''; this.phone = p.phone ?? ''; this.website = p.website ?? ''; this.industry = p.industry ?? ''; this.submitLabel = 'Save changes'; }
  }

  submit(): void {
    if (!this.name.trim()) { this.error = 'Name is required.'; return; }
    this.saving = true; this.error = '';
    if (this.prospect) {
      const req: UpdateProspectRequest = { name: this.name.trim(), email: this.email || undefined, phone: this.phone || undefined, website: this.website || undefined, industry: this.industry || undefined };
      this.api.updateProspect(this.prospect.id, req).subscribe({
        next: (p) => { this.saving = false; this.onOk.emit(p); },
        error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
      });
      return;
    }
    const req: CreateProspectRequest = { type: this.type, name: this.name.trim(), email: this.email || undefined, phone: this.phone || undefined, website: this.website || undefined, industry: this.industry || undefined };
    this.api.createProspect(req).subscribe({
      next: (p) => { this.saving = false; this.onOk.emit(p); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
