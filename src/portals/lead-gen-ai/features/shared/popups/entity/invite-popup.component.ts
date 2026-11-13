import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, ClientBusinessInvitation, CreateClientBusinessInvitationRequest, ClientBusinessRole } from '../../../../services/lead-gen-api.service';

/** Client business user invite form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-invite-popup',
  template: `
    <div class="fp">
            <label>Email *<input [(ngModel)]="email" name="email" type="email" required /></label>
      <label>Role<select [(ngModel)]="role" name="role"><option *ngFor="let o of roleOptions" [value]="o.value">{{ o.label }}</option></select></label>
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
export class LeadGenInvitePopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    email = '';
  role: ClientBusinessRole = 'Viewer';
  roleOptions = [{ value: 'Viewer', label: 'Viewer — read only' }, { value: 'Editor', label: 'Editor — read + manage' }, { value: 'ClientAdmin', label: 'Client Admin — full control' }];
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  submit(): void {
    if (!this.email.trim()) { this.error = 'Email is required.'; return; }
    this.saving = true; this.error = '';
    const req: CreateClientBusinessInvitationRequest = { email: this.email.trim(), role: this.role } as any;
    this.api.inviteClientBusinessUser(this.clientBusinessId, req).subscribe({
      next: (i) => { this.saving = false; this.onOk.emit(i); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Invite failed.'; }
    });
  }
}
