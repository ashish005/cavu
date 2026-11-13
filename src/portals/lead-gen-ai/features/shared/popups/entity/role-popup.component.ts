import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, ClientBusinessRole } from '../../../../services/lead-gen-api.service';

/** Change role — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-role-popup',
  template: `
    <div class="fp">
      <label>Role *<select [(ngModel)]="role" name="role" required><option value="">—</option><option value="'Viewer'">{{ 'Viewer — read only' }}</option><option value="'Editor'">{{ 'Editor — read + manage' }}</option><option value="'ClientAdmin'">{{ 'Client Admin — full control' }}</option><option value="'Owner'">{{ 'Owner (org)' }}</option><option value="'Admin'">{{ 'Admin (org)' }}</option><option value="'Member'">{{ 'Member (org)' }}</option></select></label>
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
export class LeadGenRolePopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  userId = '';
  mode = 'business';
  currentRole = '';
  role = 'Viewer';
  roleOptions = [{value:'Viewer',label:'Viewer — read only'},{value:'Editor',label:'Editor — read + manage'},{value:'ClientAdmin',label:'Client Admin — full control'},{value:'Owner',label:'Owner (org)'},{value:'Admin',label:'Admin (org)'},{value:'Member',label:'Member (org)'}];

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  submit(): void {
    this.saving = true; this.error = '';
    const call = this.mode === 'org'
      ? this.api.assignOrganizationMember(this.userId, String(this.role))
      : this.api.assignClientBusinessUser(this.clientBusinessId, this.userId, this.role as ClientBusinessRole);
    call.subscribe({
      next: () => { this.saving = false; this.onOk.emit(null); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Update failed.'; }
    });
  }
}
