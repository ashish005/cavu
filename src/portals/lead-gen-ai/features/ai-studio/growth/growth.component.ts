import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Campaign, Appt } from '../ai-studio.service';

@Component({
  selector: 'app-growth',
  standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="growth">
    <div class="cols">
      <section class="card">
        <div class="hd"><h3>Campaigns</h3><button class="btn" (click)="showCamp=!showCamp">+ New</button></div>
        <div *ngIf="showCamp" class="new">
          <input [(ngModel)]="cName" placeholder="name"/>
          <select [(ngModel)]="cChannel"><option>email</option><option>sms</option><option>voice</option><option>social</option></select>
          <button class="btn primary" (click)="createCamp()">Create</button>
        </div>
        <div class="item" *ngFor="let c of campaigns">
          <div><b>{{ c.name }}</b><small>{{ c.channel }}</small></div>
          <div class="acts"><span class="badge" [class.on]="c.status==='active'">{{ c.status }}</span>
            <button class="mini" (click)="studio.setCampaignStatus(c.id, c.status==='active'?'pause':'activate').subscribe(load)">{{ c.status==='active'?'Pause':'Activate' }}</button></div>
        </div>
        <p class="muted" *ngIf="!campaigns.length">No campaigns.</p>
      </section>

      <section class="card">
        <div class="hd"><h3>Appointments</h3><button class="btn" (click)="showAppt=!showAppt">+ Book</button></div>
        <div *ngIf="showAppt" class="new">
          <input type="datetime-local" [(ngModel)]="aWhen"/>
          <input type="number" [(ngModel)]="aDur" placeholder="mins" style="max-width:80px"/>
          <input [(ngModel)]="aNotes" placeholder="notes"/>
          <button class="btn primary" (click)="createAppt()">Book</button>
        </div>
        <div class="item" *ngFor="let a of appts">
          <div><b>{{ a.startUtc | date:'MMM d, h:mm a' }}</b><small>{{ a.durationMinutes }}min · {{ a.notes }}</small></div>
          <div class="acts"><span class="badge" [class.on]="a.status==='scheduled'">{{ a.status }}</span>
            <button class="mini" *ngIf="a.status==='scheduled'" (click)="studio.cancelAppointment(a.id).subscribe(load)">Cancel</button></div>
        </div>
        <p class="muted" *ngIf="!appts.length">No appointments.</p>
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
  campaigns: Campaign[] = []; appts: Appt[] = [];
  showCamp = false; showAppt = false; cName=''; cChannel='email'; aWhen=''; aDur=30; aNotes='';
  ngOnInit() { this.load(); }
  load() {
    this.studio.listCampaigns().subscribe(c => this.campaigns = c);
    this.studio.listAppointments().subscribe(p => this.appts = p.items);
  }
  createCamp() { this.studio.createCampaign(this.cName, this.cChannel).subscribe(() => { this.showCamp=false; this.cName=''; this.load(); }); }
  createAppt() {
    if (!this.aWhen) return;
    this.studio.createAppointment(undefined, new Date(this.aWhen).toISOString(), this.aDur || 30, this.aNotes).subscribe(() => { this.showAppt=false; this.aNotes=''; this.load(); });
  }
}
