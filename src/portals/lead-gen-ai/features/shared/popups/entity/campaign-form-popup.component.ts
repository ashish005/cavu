import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Campaign, CampaignRequest } from '../../../../services/lead-gen-api.service';

/** Campaign create form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-campaign-form-popup',
  template: `
    <div class="fp">
            <label>Name *<input [(ngModel)]="name" name="name" required /></label>
      <label>Channel<select [(ngModel)]="channel" name="channel"><option *ngFor="let o of channelOptions" [value]="o.value">{{ o.label }}</option></select></label>
      <label>Description<textarea [(ngModel)]="description" name="description" rows="3"></textarea></label>
      <label>Scheduled at<input [(ngModel)]="scheduledAt" name="scheduledAt" type="datetime-local" /></label>
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
export class LeadGenCampaignFormPopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    name = '';
  channel = 'Email';
  description = '';
  scheduledAt = '';
  channelOptions = [{ value: 'Email', label: 'Email' }, { value: 'SMS', label: 'SMS' }, { value: 'WhatsApp', label: 'WhatsApp' }];
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  submit(): void {
    if (!this.name.trim()) { this.error = 'Name is required.'; return; }
    this.saving = true; this.error = '';
    const req: CampaignRequest = { name: this.name.trim(), channel: this.channel, description: this.description || undefined, scheduledAt: this.scheduledAt ? new Date(this.scheduledAt).toISOString() : undefined };
    this.api.createCampaign(this.clientBusinessId, req).subscribe({
      next: (c) => { this.saving = false; this.onOk.emit(c); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
