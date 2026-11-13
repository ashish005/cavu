import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LeadGenApiService, Appointment, AppointmentRequest, AppointmentType } from '../../../../services/lead-gen-api.service';

/** Appointment booking — params assigned directly onto instance by PopupNormalComponent. */
@Component({
  selector: 'lead-gen-booking-popup',
  template: `
    <div class="fp">
      <label>Type *<select [(ngModel)]="appointmentTypeId" name="appointmentTypeId" required><option value="">—</option><option *ngFor="let t of appointmentTypes" [value]="t.id">{{ t.name }} ({{ t.durationMinutes }}m)</option></select></label>
      <label>Attendee name *<input [(ngModel)]="attendeeName" name="attendeeName" type="text" placeholder="" required /></label>
      <label>Attendee email<input [(ngModel)]="attendeeEmail" name="attendeeEmail" type="email" placeholder="" /></label>
      <label>Attendee phone<input [(ngModel)]="attendeePhone" name="attendeePhone" type="text" placeholder="" /></label>
      <label>Start at *<input [(ngModel)]="startAt" name="startAt" type="datetime-local" required /></label>
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
export class LeadGenBookingPopupComponent {
  private readonly api = inject(LeadGenApiService);
  clientBusinessId = '';
  submitLabel = 'Save';
  appointmentId = '';
  leadId = '';
  appointmentTypes: AppointmentType[] = [];
  appointmentTypeId = '';
  attendeeName = '';
  attendeeEmail = '';
  attendeePhone = '';
  startAt = '';

  saving = false;
  error = '';
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    this.api.listAppointmentTypes(this.clientBusinessId).subscribe({ next: (ts) => { this.appointmentTypes = ts; if (ts.length && !this.appointmentTypeId) this.appointmentTypeId = ts[0].id; }, error: () => undefined });
  }

  submit(): void {
    if (!this.appointmentTypeId || !this.attendeeName.trim() || !this.startAt) { this.error = 'Type, attendee and start time are required.'; return; }
    this.saving = true; this.error = '';
    const req: AppointmentRequest = { appointmentTypeId: this.appointmentTypeId, leadId: this.leadId || undefined, attendeeName: this.attendeeName.trim(), attendeeEmail: this.attendeeEmail || undefined, attendeePhone: this.attendeePhone || undefined, startAt: new Date(this.startAt).toISOString() };
    this.api.createAppointment(this.clientBusinessId, req).subscribe({
      next: (a) => { this.saving = false; this.onOk.emit(a); },
      error: (e: HttpErrorResponse) => { this.saving = false; this.error = typeof e.error?.detail === 'string' ? e.error.detail : 'Booking failed.'; }
    });
  }
}
