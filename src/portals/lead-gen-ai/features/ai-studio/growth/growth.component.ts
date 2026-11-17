import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Campaign, Appt } from '../ai-studio.service';
import { PopupService, ASIDE_CLASS, ASIDE_SIZE, TableComponent, PaginationComponent } from '@app-global';
import { CampaignPopupComponent } from '../popups/campaign-popup.component';
import { AppointmentPopupComponent } from '../popups/appointment-popup.component';
import { StudioSelectCellComponent, StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

@Component({
  selector: 'app-growth',
  standalone: true, imports: [CommonModule, FormsModule, TableComponent, PaginationComponent],
  template: `
  <div class="growth">
    <div class="page-head"><div><h1>Campaigns & Appointments</h1><p class="sub">Multi-channel campaigns and scheduling</p></div></div>
    <div class="cols">
      <section class="card">
        <div class="hd"><h3>Campaigns</h3><button class="btn" (click)="openCamp()">+ New</button></div>

        <org-grid [data]="campaigns" [options]="campGrid" [isLoading]="campLoading"></org-grid>
        <org-grid-pagination [page]="campPage" [count]="campTotal" [perPage]="campPageSize" [loading]="campLoading" (cb)="onCampPage($event)"></org-grid-pagination>
      </section>

      <section class="card">
        <div class="hd"><h3>Appointments</h3><button class="btn" (click)="openAppt()">+ Book</button></div>

        <org-grid [data]="appts" [options]="apptGrid" [isLoading]="apptLoading"></org-grid>
        <org-grid-pagination [page]="apptPage" [count]="apptTotal" [perPage]="apptPageSize" [loading]="apptLoading" (cb)="onApptPage($event)"></org-grid-pagination>
      </section>
    </div>
  </div>`,
  styles: [`
    .growth{padding:16px;max-width:1100px;margin:0 auto}.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px}
    .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}h3{margin:0;font-size:14px}
    .btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}
    .new{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}.new input,.new select{padding:7px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit}
    .item{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid var(--border,#f0f0f0)}
    .item small{display:block;color:var(--muted,#888)}.acts{display:flex;gap:6px;align-items:center}
    .badge{font-size:11px;background:#eee;border-radius:10px;padding:2px 8px}.badge.on{background:#d9f2e4;color:#1a7f4b}
    .mini{font-size:11px;padding:3px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .muted{color:var(--muted,#888);font-size:12px}
  `]
})
export class GrowthComponent implements OnInit {
  studio = inject(AiStudioService);
  popup = inject(PopupService);
  campaigns: Campaign[] = []; appts: Appt[] = [];
  showCamp = false; showAppt = false; cName=''; cChannel='email'; aWhen=''; aDur=30; aNotes='';

  campPage = 1; campPageSize = 25; campTotal = 0; campLoading = false;
  apptPage = 1; apptPageSize = 25; apptTotal = 0; apptLoading = false;

  campGrid: any = {
    header: { title: 'Campaigns', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'channel', headerName: 'Channel' },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: string) => v === 'active' ? 'ok' : '' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: (c: Campaign) => c.status === 'active' ? 'Pause' : 'Activate', run: (c: Campaign) => this.setCampStatus(c) },
      ] },
    ],
  };
  apptGrid: any = {
    header: { title: 'Appointments', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'startUtc', headerName: 'When', cellFn: (a: Appt) => new Date(a.startUtc).toLocaleString() },
      { field: 'durationMinutes', headerName: 'Duration', cellFn: (a: Appt) => a.durationMinutes + ' min' },
      { field: 'notes', headerName: 'Notes' },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: string) => v === 'scheduled' ? 'ok' : '' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Cancel', class: 'danger', when: (a: Appt) => a.status === 'scheduled', run: (a: Appt) => this.studio.cancelAppointment(a.id).subscribe(() => this.load()) },
      ] },
    ],
  };

  ngOnInit() { this.load(); }
  load() {
    this.campLoading = true;
    this.studio.listCampaigns(this.campPage, this.campPageSize).subscribe({
      next: p => { this.campaigns = p.items; this.campTotal = p.totalCount; this.campLoading = false; },
      error: () => this.campLoading = false,
    });
    this.apptLoading = true;
    this.studio.listAppointments(this.apptPage, this.apptPageSize).subscribe({
      next: p => { this.appts = p.items; this.apptTotal = p.totalCount; this.apptLoading = false; },
      error: () => this.apptLoading = false,
    });
  }
  onCampPage(e: { skip: number; take: number }) { this.campPageSize = e.take; this.campPage = Math.floor(e.skip / e.take) + 1; this.load(); }
  onApptPage(e: { skip: number; take: number }) { this.apptPageSize = e.take; this.apptPage = Math.floor(e.skip / e.take) + 1; this.load(); }
  setCampStatus(c: Campaign) { this.studio.setCampaignStatus(c.id, c.status === 'active' ? 'pause' : 'activate').subscribe(() => this.load()); }
  openCamp() {
    const popup = { header: { text: 'New campaign' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(CampaignPopupComponent, popup, { id: null, data: {}, actionType: 'Show' }).then(() => this.load()).catch(() => this.load());
  }
  openAppt() {
    const popup = { header: { text: 'Book appointment' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(AppointmentPopupComponent, popup, { id: null, data: {}, actionType: 'Show' }).then(() => this.load()).catch(() => this.load());
  }
}
