import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, IntegrationConnection, IntegrationConnectionRequest, IntegrationProvider } from '../../../../services/lead-gen-api.service';

/** Integration connect form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-connect-popup',
  template: `
    <div class="fp">
            <label>Provider *<select [(ngModel)]="providerId" name="providerId"><option value="">—</option><option *ngFor="let p of providers" [value]="p.id">{{ p.displayName }} ({{ p.key }})</option></select></label>
      <label>Credential reference<input [(ngModel)]="credentialReference" name="credentialReference" placeholder="Vault/secret reference" /></label>
      <label>Settings JSON<textarea [(ngModel)]="settingsJson" name="settingsJson" rows="4" placeholder='{"region":"us"}'></textarea></label>
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
export class LeadGenConnectPopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    providerId = '';
  credentialReference = '';
  settingsJson = '{}';
  providers: IntegrationProvider[] = [];
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.api.listIntegrationProviders().subscribe({ next: (ps) => this.providers = ps, error: () => undefined });
  }
  submit(): void {
    if (!this.providerId) { this.error = 'Provider is required.'; return; }
    let settings: any = {};
    try { settings = JSON.parse(this.settingsJson || '{}'); } catch { this.error = 'Settings must be valid JSON.'; return; }
    this.saving = true; this.error = '';
    const req: IntegrationConnectionRequest = { providerId: this.providerId, credentialReference: this.credentialReference || undefined, settingsJson: JSON.stringify(settings) };
    this.api.createIntegrationConnection(this.clientBusinessId, req).subscribe({
      next: (i) => { this.saving = false; this.onOk.emit(i); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
