import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest } from '../../../../services/lead-gen-api.service';

@Component({
  selector: 'lead-gen-workspace-popup',
  template: `
    <div class="fp">
      <label>Name *<input [(ngModel)]="name" name="name" type="text" placeholder="" required /></label>
      <label>Timezone *<input [(ngModel)]="timeZoneId" name="timeZoneId" type="text" placeholder="" required /></label>
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
export class LeadGenWorkspacePopupComponent {
  private readonly api = inject(LeadGenApiService);
  submitLabel = 'Save';
  workspace?: Workspace;
  clientBusinessIds: string[] = [];
  name = '';
  timeZoneId = 'America/Los_Angeles';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    if (this.workspace) { this.name = this.workspace.name; this.timeZoneId = this.workspace.timeZoneId; this.submitLabel = 'Workspace details'; }
    else this.submitLabel = 'Add workspace';
  }

  submit(): void {
    this.saving = true; this.error = '';
    if (this.workspace) {
      const req: UpdateWorkspaceRequest = { name: this.name.trim(), timeZoneId: this.timeZoneId };
      this.api.updateWorkspace(this.workspace.id, req).subscribe({
        next: (w) => { this.saving = false; this.onOk.emit(w); },
        error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
      });
      return;
    }
    const req = { name: this.name.trim(), timeZoneId: this.timeZoneId, clientBusinessIds: this.clientBusinessIds.length ? this.clientBusinessIds : undefined } as CreateWorkspaceRequest;
    this.api.createWorkspace(req).subscribe({
      next: (w) => { this.saving = false; this.onOk.emit(w); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Save failed.'; }
    });
  }
}
