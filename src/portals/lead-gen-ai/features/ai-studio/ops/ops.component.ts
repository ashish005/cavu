import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Schedule, Hook, Job } from '../ai-studio.service';

@Component({
  selector: 'app-ops',
  standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="ops">
    <div class="hd"><h2>Operations</h2><button class="btn primary" (click)="seed()">⚡ Load demo data ({{ studio.workspace?.label }})</button></div>
    <p class="muted" *ngIf="seedMsg">{{ seedMsg }}</p>

    <div class="cols">
      <section class="card">
        <h3>Background jobs</h3>
        <div class="filters"><button class="chip" [class.on]="jobStatus===''" (click)="jobStatus='';loadJobs()">All</button>
          <button class="chip" [class.on]="jobStatus==='queued'" (click)="jobStatus='queued';loadJobs()">Queued</button>
          <button class="chip" [class.on]="jobStatus==='dead'" (click)="jobStatus='dead';loadJobs()">Dead</button>
          <button class="chip" [class.on]="jobStatus==='completed'" (click)="jobStatus='completed';loadJobs()">Done</button></div>
        <table><thead><tr><th>Type</th><th>Status</th><th>Attempts</th><th>Run at</th><th></th></tr></thead>
        <tbody><tr *ngFor="let j of jobs">
          <td>{{ j.jobType }}</td><td><span class="badge" [class.dead]="j.status==='dead'" [class.ok]="j.status==='completed'">{{ j.status }}</span></td>
          <td>{{ j.attempts }}/{{ j.maxAttempts }}</td><td>{{ j.runAt|date:'short' }}</td>
          <td><button class="mini" *ngIf="j.status==='dead'||j.status==='queued'" (click)="studio.retryJob(j.id).subscribe(loadJobs)">Retry</button></td></tr></tbody></table>
        <p class="muted" *ngIf="!jobs.length">No jobs.</p>
      </section>

      <section class="card">
        <h3>Webhooks</h3>
        <div class="new"><input [(ngModel)]="hUrl" placeholder="https://…"/>
          <input [(ngModel)]="hEvents" placeholder="events e.g. * or workflow.executed"/>
          <button class="btn" (click)="addHook()">Add</button></div>
        <div class="item" *ngFor="let h of hooks">
          <div><b class="url">{{ h.url }}</b><small>{{ h.eventsJson }} · fails: {{ h.failureCount }}</small></div>
          <div class="acts"><span class="badge" [class.on]="h.isActive">{{ h.isActive?'active':'off' }}</span>
            <button class="mini" (click)="studio.toggleHook(h.id).subscribe(loadHooks)">Toggle</button>
            <button class="mini" (click)="studio.deleteHook(h.id).subscribe(loadHooks)">Del</button></div>
        </div>
        <p class="muted" *ngIf="!hooks.length">No webhooks.</p>
        <div class="ping"><input [(ngModel)]="pingUrl" placeholder="provider URL to ping"/><button class="mini" (click)="ping()">Ping</button><span *ngIf="pingRes"> {{ pingRes }}</span></div>
      </section>
    </div>
  </div>`,
  styles: [`
    .ops{padding:16px;max-width:1100px;margin:0 auto}.hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    h2{margin:0;font-size:18px}.card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px;margin-bottom:14px}
    h3{margin:0 0 10px;font-size:14px}.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .btn{padding:6px 14px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}
    .filters{display:flex;gap:6px;margin-bottom:8px}.chip{padding:3px 10px;border-radius:12px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .chip.on{background:#3467d6;color:#fff;border-color:#3467d6}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:6px 8px;border-bottom:1px solid var(--border,#f0f0f0);text-align:left}
    .badge{font-size:11px;background:#eee;border-radius:10px;padding:2px 8px}.badge.ok{background:#d9f2e4;color:#1a7f4b}.badge.dead{background:#fde2e2;color:#c0392b}.badge.on{background:#d9f2e4;color:#1a7f4b}
    .mini{font-size:11px;padding:3px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .item{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid var(--border,#f0f0f0)}
    .item small{display:block;color:var(--muted,#888)}.url{font-size:12px;word-break:break-all}.acts{display:flex;gap:6px;align-items:center}
    .new{display:flex;gap:6px;margin-bottom:8px}.new input,.ping input{padding:7px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit;flex:1}
    .ping{display:flex;gap:6px;margin-top:10px;align-items:center}.muted{color:var(--muted,#888);font-size:12px}
  `]
})
export class OpsComponent implements OnInit {
  studio = inject(AiStudioService);
  jobs: Job[] = []; hooks: Hook[] = []; schedules: Schedule[] = [];
  jobStatus = ''; hUrl=''; hEvents='*'; pingUrl=''; pingRes=''; seedMsg='';
  ngOnInit() { this.loadJobs(); this.loadHooks(); this.studio.listSchedules().subscribe(s => this.schedules = s); }
  loadJobs() { this.studio.listJobs(this.jobStatus || undefined).subscribe(p => this.jobs = p.items); }
  loadHooks() { this.studio.listHooks().subscribe(h => this.hooks = h); }
  addHook() { if (!this.hUrl) return; this.studio.createHook(this.hUrl, `["${this.hEvents}"]`).subscribe(() => { this.hUrl=''; this.loadHooks(); }); }
  ping() { if (!this.pingUrl) return; this.studio.pingProvider(this.pingUrl).subscribe(r => this.pingRes = r.ok ? '✓ '+r.detail : '✗ '+r.detail); }
  seed() {
    const force = confirm('Load demo data? This wipes existing demo records for a clean reseed.');
    if (!force) return;
    this.studio.seedDemo(true, this.studio.workspace?.key).subscribe(r => { this.seedMsg = `${r.message} (${r.records} records)`; this.loadJobs(); this.studio.refreshAll(); });
  }
}
