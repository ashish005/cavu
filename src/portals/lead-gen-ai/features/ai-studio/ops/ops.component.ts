import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Schedule, Hook, Job } from '../ai-studio.service';

@Component({
  selector: 'app-ops',
  standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="ops">
    <div class="page-head"><div><h1>Operations</h1><p class="sub">Jobs, schedules, webhooks, providers & demo data</p></div></div>
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
        <table><thead><tr><th>Provider</th><th>Calls</th><th>Success</th><th>Avg ms</th><th>Cost</th></tr></thead>
          <tbody><tr *ngFor="let a of analytics?.providers">
            <td>{{ a.provider }}</td><td>{{ a.calls }}</td>
            <td>{{ (a.successRate * 100 | number:'1.0-0') }}%</td><td>{{ a.avgLatencyMs | number:'1.0-0' }}</td>
            <td>&#36;{{ a.totalCostUsd | number:'1.4-4' }}</td></tr></tbody></table>
        <p class="muted" *ngIf="!analytics?.providers?.length">No calls recorded yet — run agents/workflows to populate.</p>
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
  ngOnInit() { this.loadJobs(); this.loadHooks(); this.studio.listSchedules().subscribe(s => this.schedules = s); this.loadProviders(); this.loadRules(); this.loadAnalytics(); }
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
