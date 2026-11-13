import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Organization, OrganizationRequest } from '../../../../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-org-popup',
  template: `
    <div class="fp">
      <label>Name *<input [(ngModel)]="name" name="name" type="text" placeholder="" required /></label>
      <label>Slug *<input [(ngModel)]="slug" name="slug" type="text" placeholder="my-org" required /></label>
      <label>Timezone *<input [(ngModel)]="defaultTimeZoneId" name="defaultTimeZoneId" type="text" placeholder="" required /></label>
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
export class LeadGenOrgPopupComponent {
  private readonly api = inject(LeadGenApiService);
  submitLabel = 'Save';
  org?: Organization;
  name = '';
  slug = '';
  defaultTimeZoneId = 'America/Los_Angeles';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    if (this.org) { this.name = this.org.name; this.slug = this.org.slug; this.defaultTimeZoneId = this.org.defaultTimeZoneId; this.submitLabel = 'Update organization'; }
    else this.submitLabel = 'Create organization';
  }

  submit(): void {
    this.saving = true; this.error = '';
    const req = { name: this.name.trim(), slug: this.slug.trim(), defaultTimeZoneId: this.defaultTimeZoneId } as OrganizationRequest;
    const call = this.org ? this.api.updateOrganization(req) : this.api.createOrganization(req);
    call.subscribe({
      next: (o) => { this.saving = false; this.onOk.emit(o); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
