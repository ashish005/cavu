import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, AgentExecution } from '../../../../services/lead-gen-api.service';

/** Run AI agent — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-agent-run-popup',
  template: `
    <div class="fp">
      <label>Run kind<select [(ngModel)]="kind" name="kind"><option value="">—</option><option value="'summary'">{{ 'Summary' }}</option><option value="'qualification'">{{ 'Qualification' }}</option><option value="'followup'">{{ 'Follow-up draft' }}</option><option value="'custom'">{{ 'Custom' }}</option></select></label>
      <label>Input / context<textarea [(ngModel)]="input" name="input" rows="3" placeholder=""></textarea></label>
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
export class LeadGenAgentRunPopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  agentId = '';
  agentName = '';
  kind = 'summary';
  input = '';
  kindOptions = [{value:'summary',label:'Summary'},{value:'qualification',label:'Qualification'},{value:'followup',label:'Follow-up draft'},{value:'custom',label:'Custom'}];

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  submit(): void {
    this.saving = true; this.error = '';
    this.api.runAgent(this.clientBusinessId, this.agentId, this.kind, this.input || undefined).subscribe({
      next: (x) => { this.saving = false; this.onOk.emit(x); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Run failed.'; }
    });
  }
}
