import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, AiAgent, AiAgentRequest } from '../../../../services/lead-gen-api.service';

/** AI agent create form — parameters are assigned directly onto this instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-agent-form-popup',
  template: `
    <div class="fp">
            <label>Name *<input [(ngModel)]="name" name="name" required /></label>
      <label>Purpose *<input [(ngModel)]="purpose" name="purpose" required placeholder="What this agent does" /></label>
      <label>Behaviour JSON<textarea [(ngModel)]="behaviourJson" name="behaviourJson" rows="3"></textarea></label>
      <label>Permissions JSON<textarea [(ngModel)]="permissionsJson" name="permissionsJson" rows="2"></textarea></label>
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
export class LeadGenAgentFormPopupComponent {
  private readonly api = inject(LeadGenApiService);
  // context assigned by popup wrapper
  clientBusinessId = '';
  submitLabel = 'Save';
    name = '';
  purpose = '';
  behaviourJson = '{"tone":"professional","language":"en"}';
  permissionsJson = '{"canSendEmail":true,"canUpdateLeads":true}';
  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  submit(): void {
    if (!this.name.trim() || !this.purpose.trim()) { this.error = 'Name and purpose are required.'; return; }
    this.saving = true; this.error = '';
    let behaviour: any, permissions: any;
    try { behaviour = JSON.parse(this.behaviourJson || '{}'); permissions = JSON.parse(this.permissionsJson || '{}'); }
    catch { this.error = 'JSON fields must be valid.'; this.saving = false; return; }
    const req: AiAgentRequest = { name: this.name.trim(), purpose: this.purpose.trim(), behaviourJson: JSON.stringify(behaviour), permissionsJson: JSON.stringify(permissions) } as any;
    this.api.createAgent(this.clientBusinessId, req).subscribe({
      next: (a) => { this.saving = false; this.onOk.emit(a); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
