import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeadGenApiService, ClientBusiness, AppointmentType, Appointment
} from '../../services/lead-gen-api.service';
import { WorkspaceContextService } from '../../services/workspace-context.service';
import { PopupService } from '@app-global';
import { LeadGenEntityFormPopupComponent, EntityFormField } from '../shared/popups/lead-gen-entity-form-popup.component';

@Component({
  selector: 'lead-gen-appointments',
  templateUrl: './lead-gen-appointments.component.html',
  styleUrls: ['./lead-gen-appointments.component.scss'],
  standalone: false
})
export class LeadGenAppointmentsComponent implements OnInit {
  clientBusinessId = '';
  clientBusinesses: ClientBusiness[] = [];
  types: AppointmentType[] = [];
  appointments: Appointment[] = [];
  loading = false;
  error = '';
  message = '';
  viewDate = new Date();

  constructor(
    private readonly api: LeadGenApiService,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly popupService: PopupService
  ) {}

  get dayAppointments(): Appointment[] {
    const day = this.viewDate.toDateString();
    return this.appointments.filter(a => new Date(a.startAt).toDateString() === day)
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }

  get upcoming(): Appointment[] {
    const now = Date.now();
    return this.appointments.filter(a => new Date(a.startAt).getTime() >= now && a.status !== 'Cancelled' && a.status !== 'Completed')
      .sort((a, b) => a.startAt.localeCompare(b.startAt)).slice(0, 8);
  }

  typeName(id: string): string { return this.types.find(t => t.id === id)?.name ?? 'Appointment'; }

  ngOnInit(): void {
    this.clientBusinessId = this.workspaceContext.current?.clientBusinessId ?? '';
    this.api.listClientBusinesses().subscribe({
      next: (bs) => {
        this.clientBusinesses = bs;
        if (!this.clientBusinessId && bs.length) this.clientBusinessId = bs[0].id;
        this.load();
      },
      error: (e: HttpErrorResponse) => this.error = this.err(e)
    });
  }

  onBusinessChange(id: string): void { this.clientBusinessId = id; this.load(); }

  load(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.loading = true;
    this.error = '';
    const from = new Date(this.viewDate); from.setHours(0, 0, 0, 0);
    const to = new Date(from); to.setDate(to.getDate() + 30);
    this.api.listAppointmentTypes(cb).subscribe({ next: (t) => this.types = t, error: () => undefined });
    this.api.listAppointments(cb, from.toISOString(), to.toISOString()).subscribe({
      next: (a) => { this.appointments = a; this.loading = false; },
      error: (e) => { this.error = this.err(e); this.loading = false; }
    });
  }

  shiftDay(delta: number): void { this.viewDate = new Date(this.viewDate.getTime() + delta * 86400000); this.load(); }
  today(): void { this.viewDate = new Date(); this.load(); }

  openPopup(fields: EntityFormField[], submitLabel: string, run: (v: Record<string, string>) => Observable<unknown>, onDone?: () => void): void {
    const parameters = {
      fields, submitLabel,
      onSubmit: (values: Record<string, string>) => new Promise<void>((resolve, reject) => {
        run(values).subscribe({
          next: () => { this.popupService.destroy(); onDone?.(); resolve(); },
          error: (e: HttpErrorResponse) => reject(new Error(this.err(e)))
        });
      }),
      onCancel: () => this.popupService.destroy()
    };
    this.popupService.showCustomPopup(LeadGenEntityFormPopupComponent, { size: 'W_50' }, parameters)
      .then(() => this.popupService.destroy(), () => this.popupService.destroy());
  }

  book(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'appointmentTypeId', label: 'Type', type: 'select', required: true,
        options: this.types.map(t => ({ value: t.id, label: `${t.name} (${t.durationMinutes}m)` })) },
      { key: 'attendeeName', label: 'Attendee name', required: true },
      { key: 'attendeeEmail', label: 'Email' },
      { key: 'attendeePhone', label: 'Phone' },
      { key: 'startAt', label: 'Start', type: 'datetime', required: true }
    ], 'Book', (v) => this.api.createAppointment(cb, {
      appointmentTypeId: v['appointmentTypeId'], attendeeName: v['attendeeName'],
      attendeeEmail: v['attendeeEmail'] || undefined, attendeePhone: v['attendeePhone'] || undefined,
      startAt: new Date(v['startAt']).toISOString()
    }), () => { this.message = 'Appointment booked.'; this.load(); });
  }

  newType(): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([
      { key: 'name', label: 'Type name', required: true, placeholder: 'Consultation' },
      { key: 'durationMinutes', label: 'Duration (minutes)', required: true, placeholder: '30' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ], 'Create type', (v) => this.api.createAppointmentType(cb, {
      name: v['name'], durationMinutes: parseInt(v['durationMinutes'], 10) || 30,
      description: v['description'] || undefined, isActive: true
    }), () => { this.message = 'Appointment type created.'; this.load(); });
  }

  reschedule(a: Appointment): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.openPopup([{ key: 'startAt', label: 'New start', type: 'datetime', required: true }], 'Reschedule',
      (v) => this.api.rescheduleAppointment(cb, a.id, new Date(v['startAt']).toISOString()),
      () => { this.message = 'Appointment rescheduled.'; this.load(); });
  }

  cancel(a: Appointment): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.cancelAppointment(cb, a.id).subscribe({
      next: () => { this.message = 'Appointment cancelled.'; this.load(); },
      error: (e) => this.error = this.err(e)
    });
  }

  remind(a: Appointment): void {
    const cb = this.clientBusinessId;
    if (!cb) return;
    this.api.sendAppointmentReminder(cb, a.id).subscribe({
      next: () => { this.message = 'Reminder sent.'; },
      error: (e) => this.error = this.err(e)
    });
  }

  private err(e: HttpErrorResponse): string {
    return typeof e.error?.detail === 'string' ? e.error.detail : 'Request failed.';
  }
}
