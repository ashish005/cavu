import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, ClientBusiness, CreateClientBusinessRequest } from '../../../../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-business-popup',
  template: `
    <div class="fp">
      <label>Name *<input [(ngModel)]="name" name="name" type="text" placeholder="" required /></label>
      <label>Slug *<input [(ngModel)]="slug" name="slug" type="text" placeholder="my-business" required /></label>
      <label>Country code *<input [(ngModel)]="countryCode" name="countryCode" type="text" placeholder="US" required /></label>
      <label>Timezone *<input [(ngModel)]="defaultTimeZoneId" name="defaultTimeZoneId" type="text" placeholder="" required /></label>
      <div class="fp-sections" *ngIf="business">
        <span class="fp-sections-label">Also manage:</span>
        <button type="button" class="fp-link" (click)="go('profile')">Profile</button>
        <button type="button" class="fp-link" (click)="go('offerings')">Offerings</button>
        <button type="button" class="fp-link" (click)="go('industries')">Industries</button>
        <button type="button" class="fp-link" (click)="go('packs')">Packs</button>
      </div>
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
export class LeadGenBusinessPopupComponent {
  private readonly api = inject(LeadGenApiService);
  submitLabel = 'Save';
  business?: ClientBusiness;
  name = '';
  slug = '';
  countryCode = 'US';
  defaultTimeZoneId = 'America/Los_Angeles';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    if (this.business) { const b: any = this.business; this.name = b.name; this.slug = b.slug; this.countryCode = b.countryCode ?? 'US'; this.defaultTimeZoneId = b.defaultTimeZoneId ?? 'America/Los_Angeles'; this.submitLabel = 'Edit business'; }
    else this.submitLabel = 'Add business';
  }

  go(section: string): void { this.onOk.emit({ section }); }

  submit(): void {
    this.saving = true; this.error = '';
    const req = { name: this.name.trim(), slug: this.slug.trim(), countryCode: this.countryCode.trim().toUpperCase(), defaultTimeZoneId: this.defaultTimeZoneId } as CreateClientBusinessRequest;
    const call = this.business ? this.api.updateClientBusiness(this.business.id, req) : this.api.createClientBusiness(req);
    call.subscribe({
      next: (b) => { this.saving = false; this.onOk.emit(b); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
