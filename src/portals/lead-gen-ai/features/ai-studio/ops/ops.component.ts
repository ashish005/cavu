import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService, Schedule, Hook, Job } from '../ai-studio.service';
import { StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

@Component({
  selector: 'app-ops',
  standalone: true, imports: [CommonModule, FormsModule, TableComponent, PaginationComponent],
  template: `
  <div class="ops">
    <div class="page-head"><div><h1>Operations</h1><p class="sub">Jobs, schedules, webhooks, providers & demo data</p></div></div>
    <div class="hd"><h2>Operations</h2><button class="btn primary" (click)="seed()">⚡ Seed {{ studio.industry?.label || studio.workspace?.label }} demo data</button></div>
    <p class="muted" *ngIf="seedMsg">{{ seedMsg }}</p>

    <div class="cols">
      <section class="card">
        <h3>Background jobs</h3>
        <div class="filters"><button class="chip" [class.on]="jobStatus===''" (click)="jobStatus='';loadJobs()">All</button>
          <button class="chip" [class.on]="jobStatus==='queued'" (click)="jobStatus='queued';loadJobs()">Queued</button>
          <button class="chip" [class.on]="jobStatus==='dead'" (click)="jobStatus='dead';loadJobs()">Dead</button>
          <button class="chip" [class.on]="jobStatus==='completed'" (click)="jobStatus='completed';loadJobs()">Done</button></div>
        <org-grid [data]="jobs" [options]="jobsGrid" [isLoading]="jobsLoading"></org-grid>
        <org-grid-pagination [page]="jobsPage" [count]="jobsTotal" [perPage]="jobsPageSize" [loading]="jobsLoading" (cb)="onJobsPage($event)"></org-grid-pagination>
      </section>

      <section class="card">
        <h3>Webhooks</h3>
        <div class="new"><input [(ngModel)]="hUrl" placeholder="https://…"/>
          <input [(ngModel)]="hEvents" placeholder="events e.g. * or workflow.executed"/>
          <button class="btn" (click)="addHook()">Add</button></div>
        <org-grid [data]="hooks" [options]="hooksGrid" [isLoading]="hooksLoading"></org-grid>
        <org-grid-pagination [page]="hooksPage" [count]="hooksTotal" [perPage]="hooksPageSize" [loading]="hooksLoading" (cb)="onHooksPage($event)"></org-grid-pagination>
        <div class="ping"><input [(ngModel)]="pingUrl" placeholder="provider URL to ping"/><button class="mini" (click)="ping()">Ping</button><span *ngIf="pingRes"> {{ pingRes }}</span></div>
      </section>

      <section class="card">
        <h3>AI Providers (LLM + Voice)</h3>
        <p class="muted">Set an API key to go live — empty key = deterministic simulation. Routing rules pick the provider per task; analytics compare performance.</p>
        <div class="prov-grid">
          <div class="prov" *ngFor="let p of providers" [class.live]="p.live">
            <div class="p-head"><b>{{ p.label }}</b><span class="badge" [class.ok]="p.live" [class.on]="p.enabled">{{ p.live ? 'LIVE' : 'sim' }}</span></div>
            <small class="muted">{{ p.model || '—' }} · &#36;{{ p.costPer1kIn }}/1k in · ~{{ p.avgLatencyMs }}ms</small>
            <small class="muted">{{ p.tasks }}</small>
            <div class="p-acts">
              <button class="mini" (click)="editCred(p)">{{ p.configured ? 'Configure' : 'Set key' }}</button>
              <button class="mini" (click)="testProv(p)">Test</button>
              <button class="mini" (click)="toggleProv(p)">{{ p.enabled ? 'Disable' : 'Enable' }}</button>
            </div>
          </div>
        </div>
        <div *ngIf="testOut" class="runout"><b>Test:</b> {{ testOut }}</div>
      </section>

      <section class="card">
        <h3>Routing rules</h3>
        <p class="muted">Task type → provider. Rules override default priority order.</p>
        <div class="item" *ngFor="let r of rules">
          <div><b>{{ r.taskType }}</b> → {{ r.providerKey }} <small>(min priority {{ r.minPriority }})</small></div>
          <button class="mini" (click)="delRule(r.taskType)">Remove</button>
        </div>
        <div class="new">
          <input [(ngModel)]="ruleTask" placeholder="task (score/classify/draft/reply/summarize/agent/voice-script)"/>
          <input [(ngModel)]="ruleProv" placeholder="provider key (e.g. openai-gpt4omini)"/>
          <button class="mini" (click)="addRule()">Add rule</button>
        </div>
      </section>

      <section class="card">
        <h3>Provider analytics (30d)</h3>
        <org-grid [data]="analytics?.providers || []" [options]="providersGrid"></org-grid>
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
    .prov-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-top:8px}
    .prov{border:1px solid var(--border,#eee);border-radius:8px;padding:10px}.prov.live{border-color:#1a9e5c;background:#f4fdf8}
    .p-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
    .p-acts{display:flex;gap:6px;margin-top:8px}.runout{margin-top:10px;padding:8px;background:#f0f6ff;border-radius:8px;font-size:12px}
  `]
})
export class OpsComponent implements OnInit {
  studio = inject(AiStudioService);
  jobs: Job[] = []; hooks: Hook[] = []; schedules: Schedule[] = [];
  jobStatus = ''; hUrl=''; hEvents='*'; pingUrl=''; pingRes=''; seedMsg='';
  providers: any[] = []; rules: any[] = []; analytics: any; testOut = '';
  ruleTask=''; ruleProv='';
  jobsPage = 1; jobsPageSize = 25; jobsTotal = 0; jobsLoading = false;
  hooksPage = 1; hooksPageSize = 25; hooksTotal = 0; hooksLoading = false;
  jobsGrid: any = {
    header: { title: 'Background jobs', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'jobType', headerName: 'Type' },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v === 'completed' ? 'ok' : v === 'dead' ? 'danger' : '' },
      { headerName: 'Attempts', cellFn: (j: Job) => j.attempts + '/' + j.maxAttempts },
      { headerName: 'Run at', cellFn: (j: Job) => new Date(j.runAt).toLocaleString() },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Retry', when: (j: Job) => j.status === 'dead' || j.status === 'queued', run: (j: Job) => this.studio.retryJob(j.id).subscribe(() => this.loadJobs()) },
      ] },
    ],
  };
  hooksGrid: any = {
    header: { title: 'Webhooks', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'url', headerName: 'Url' },
      { field: 'eventsJson', headerName: 'Events' },
      { field: 'failureCount', headerName: 'Fails' },
      { field: 'isActive', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v ? 'ok' : '' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Toggle', run: (h: Hook) => this.studio.toggleHook(h.id).subscribe(() => this.loadHooks()) },
        { label: 'Del', class: 'danger', run: (h: Hook) => this.studio.deleteHook(h.id).subscribe(() => this.loadHooks()) },
      ] },
    ],
  };
  providersGrid: any = {
    header: { title: 'Provider analytics', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'provider', headerName: 'Provider' },
      { field: 'calls', headerName: 'Calls' },
      { headerName: 'Success', cellFn: (a: any) => (a.successRate * 100).toFixed(0) + '%' },
      { headerName: 'Avg ms', cellFn: (a: any) => Math.round(a.avgLatencyMs) },
      { headerName: 'Cost', cellFn: (a: any) => '$' + a.totalCostUsd.toFixed(4) },
    ],
  };
  ngOnInit() { this.loadJobs(); this.loadHooks(); this.studio.listSchedules(1, 100).subscribe(p => this.schedules = p.items); this.loadProviders(); this.loadRules(); this.loadAnalytics(); }
  loadProviders() { this.studio.listProviders().subscribe(p => this.providers = p); }
  loadRules() { this.studio.listRules().subscribe(r => this.rules = r); }
  loadAnalytics() { this.studio.llmAnalytics().subscribe(a => this.analytics = a); }
  editCred(p: any) {
    const key = prompt(`API key for ${p.label} (leave blank to keep current, 'clear' to remove):`);
    if (key === null) return;
    const body: any = { enabled: true, priority: 100 };
    if (key === 'clear') body.apiKey = '';
    else if (key.trim()) body.apiKey = key.trim();
    const model = prompt('Model override (blank = catalog default):', p.model || '');
    if (model && model.trim()) body.model = model.trim();
    this.studio.saveCredential(p.key, body).subscribe(() => this.loadProviders());
  }
  testProv(p: any) { this.testOut = `Testing ${p.label}…`; this.studio.testProvider(p.key).subscribe(r => this.testOut = `${r.provider} (${r.live?'LIVE':'sim'}) ${r.latencyMs}ms → ${r.output?.slice(0,120)}`); }
  toggleProv(p: any) { this.studio.saveCredential(p.key, { enabled: !p.enabled, priority: 100 }).subscribe(() => this.loadProviders()); }
  addRule() { if (!this.ruleTask || !this.ruleProv) return; this.studio.saveRule(this.ruleTask.trim(), this.ruleProv.trim()).subscribe(() => { this.ruleTask=''; this.ruleProv=''; this.loadRules(); }); }
  delRule(t: string) { this.studio.deleteRule(t).subscribe(() => this.loadRules()); }
  loadJobs() {
    this.jobsLoading = true;
    this.studio.listJobs(this.jobStatus || undefined, this.jobsPage, this.jobsPageSize).subscribe({
      next: p => { this.jobs = p.items; this.jobsTotal = p.totalCount; this.jobsLoading = false; },
      error: () => this.jobsLoading = false,
    });
  }
  loadHooks() {
    this.hooksLoading = true;
    this.studio.listHooks(this.hooksPage, this.hooksPageSize).subscribe({
      next: p => { this.hooks = p.items; this.hooksTotal = p.totalCount; this.hooksLoading = false; },
      error: () => this.hooksLoading = false,
    });
  }
  onJobsPage(e: { skip: number; take: number }) { this.jobsPageSize = e.take; this.jobsPage = Math.floor(e.skip / e.take) + 1; this.loadJobs(); }
  onHooksPage(e: { skip: number; take: number }) { this.hooksPageSize = e.take; this.hooksPage = Math.floor(e.skip / e.take) + 1; this.loadHooks(); }
  addHook() { if (!this.hUrl) return; this.studio.createHook(this.hUrl, `["${this.hEvents}"]`).subscribe(() => { this.hUrl=''; this.loadHooks(); }); }
  ping() { if (!this.pingUrl) return; this.studio.pingProvider(this.pingUrl).subscribe(r => this.pingRes = r.ok ? '✓ '+r.detail : '✗ '+r.detail); }
  seed() {
    const force = confirm('Load demo data? This wipes existing demo records for a clean reseed (atomic per tenant).');
    if (!force) return;
    this.studio.seedDemo(true, this.studio.workspace?.key, this.studio.industry?.key).subscribe(r => { this.seedMsg = `${r.message} (${r.records} records)`; this.loadJobs(); this.studio.refreshAll(); });
  }
}
