import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Agent, Workflow, Schedule, Exec, StudioEntity } from '../ai-studio.service';
import { PopupService, ASIDE_CLASS, ASIDE_SIZE, TableComponent, PaginationComponent } from '@app-global';
import { AgentPopupComponent } from '../popups/agent-popup.component';
import { WorkflowPopupComponent } from '../popups/workflow-popup.component';
import { WorkflowBuilderComponent } from './workflow-builder.component';
import { StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

const PROVIDERS = ['gemini', 'claude', 'openai', 'sip-voice'];

type Tone = (v: string) => string;
const execTone: Tone = (v: string) => v === 'completed' ? 'ok' : v === 'failed' ? 'danger' : v === 'running' || v === 'queued' ? 'warn' : '';

@Component({
  selector: 'app-automation',
  standalone: true, imports: [CommonModule, FormsModule, WorkflowBuilderComponent, TableComponent, PaginationComponent, StudioRowActionsCell, StudioBadgeCellComponent],
  template: `
  <div class="auto">
    <div class="page-head"><div><h1>Automation Studio</h1><p class="sub">AI workforce, workflows, schedules & execution recovery</p></div></div>
    <div class="cols">
      <section class="card">
        <div class="hd"><h3>AI Agents</h3><button class="btn" (click)="openAgent()">+ New</button></div>

        <org-grid [data]="agents" [options]="agentsGrid" [isLoading]="agentsLoading"></org-grid>
        <org-grid-pagination [page]="agentsPage" [count]="agentsTotal" [perPage]="agentsPageSize" [loading]="agentsLoading" (cb)="onAgentsPage($event)"></org-grid-pagination>
        <div class="runout" *ngIf="lastRun"><b>Last run:</b> {{ lastRun.output }}</div>
      </section>

      <section class="card">
        <div class="hd"><h3>Workflows</h3>
          <div><button class="btn" (click)="toggleBuilder()">{{ builderWf ? 'List view' : 'Builder' }}</button>
          <button class="btn" (click)="openWf()">+ New</button></div></div>

        <org-grid [data]="workflows" [options]="wfGrid" [isLoading]="wfLoading"></org-grid>
        <org-grid-pagination [page]="wfPage" [count]="wfTotal" [perPage]="wfPageSize" [loading]="wfLoading" (cb)="onWfPage($event)"></org-grid-pagination>
        <div class="runout" *ngIf="lastExec">Execution: <b>{{ lastExec.status }}</b> {{ lastExec.error || '' }}<span *ngIf="execSteps.length"> · {{ execSteps.length }} step(s) completed</span></div>
      </section>
    </div>

    <!-- Agent console (US-6.1): provider routing, guardrails, citations, dry-run, logs -->
    <section class="card" *ngIf="consoleAgent">
      <div class="hd"><h3>Agent console · {{ consoleAgent.name }}</h3><button class="btn" (click)="consoleAgent=null">✕</button></div>
      <div class="cols2">
        <div class="field"><label>Display name</label><input [(ngModel)]="cName"/></div>
        <div class="field"><label>Model provider routing</label>
          <select [(ngModel)]="cProvider"><option *ngFor="let p of providers" [value]="p">{{ p }}</option></select></div>
      </div>
      <div class="field"><label>Purpose</label><input [(ngModel)]="cPurpose"/></div>
      <div class="field"><label>Guardrails (one per line)</label><textarea rows="4" [(ngModel)]="cGuardrails" placeholder="Never promise pricing without verification&#10;Cite every claim"></textarea></div>
      <label class="chk"><input type="checkbox" [(ngModel)]="cCitations"/> Enforce citations on every generated message</label>
      <div class="acts">
        <button class="btn primary" (click)="saveConsole()">Save configuration</button>
        <button class="btn" (click)="toggleAgent(consoleAgent)">{{ consoleAgent.status === 'active' ? 'Pause agent' : 'Activate agent' }}</button>
        <span class="badge" [class.on]="consoleAgent.status==='active'">{{ consoleAgent.status }}</span>
      </div>

      <h4>Dry-run tester</h4>
      <div class="cols2">
        <div class="field"><label>Test against a real entity</label>
          <select [(ngModel)]="dryRunEntityId" (change)="prefillDryRun()">
            <option value="">— pick an entity —</option>
            <option *ngFor="let e of entities" [value]="e.id">{{ e.name }} · {{ e.classification }}</option>
          </select></div>
        <div class="field"><label>Sample input</label><input [(ngModel)]="dryRunInput" placeholder="Qualify this inbound lead"/></div>
      </div>
      <button class="btn primary" (click)="dryRun()" [disabled]="!dryRunInput.trim()">Dry-run</button>
      <div class="runout" *ngIf="dryRunOut"><b>Output:</b> {{ dryRunOut }}</div>

      <h4>Recent execution logs</h4>
      <table>
        <thead><tr><th>Ran at</th><th>Input</th><th>Output</th><th>Status</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of agentLogs"><td>{{ r.ranAt | date:'MMM d, h:mm a' }}</td><td>{{ r.input }}</td>
            <td class="muted">{{ r.output }}</td>
            <td><span class="badge" [class.on]="r.status==='completed'">{{ r.status }}</span></td></tr>
        </tbody>
      </table>
      <p class="muted" *ngIf="!agentLogs.length">No runs recorded yet.</p>
    </section>

    <!-- Workflow execution logs (US-7.1): retry failed steps -->
    <section class="card" *ngIf="logsWf">
      <div class="hd"><h3>Execution logs · {{ logsWf.name }}</h3>
        <div><button class="btn" (click)="loadExecs()">Refresh</button><button class="btn" (click)="logsWf=null">✕</button></div></div>
      <org-grid [data]="execs" [options]="execGrid" [isLoading]="execsLoading"></org-grid>
      <org-grid-pagination [page]="execPage" [count]="execsTotal" [perPage]="execPageSize" [loading]="execsLoading" (cb)="onExecPage($event)"></org-grid-pagination>
    </section>

    <section class="card" *ngIf="builderWf">
      <div class="hd"><h3>Builder: {{ builderWf.name }}</h3>
        <div><button class="btn primary" (click)="saveBuilder()">Save</button>
        <button class="btn" (click)="builderWf=null">✕</button></div></div>
      <app-workflow-builder [definitionJson]="builderJson" (changedJson)="builderJson=$event"></app-workflow-builder>
    </section>

    <section class="card" *ngIf="schedWf">
      <div class="hd"><h3>Schedule: {{ schedWf.name }}</h3><button class="btn" (click)="schedWf=null">✕</button></div>
      <div class="new"><input [(ngModel)]="cronExpr" placeholder="cron (min hour dom mon dow)"/>
        <button class="btn primary" (click)="addSchedule()">Add schedule</button></div>
      <org-grid [data]="schedules" [options]="schedGrid" [isLoading]="schedLoading"></org-grid>
      <org-grid-pagination [page]="schedPage" [count]="schedTotal" [perPage]="schedPageSize" [loading]="schedLoading" (cb)="onSchedPage($event)"></org-grid-pagination>
    </section>
  </div>`,
  styles: [`
    .auto{padding:16px;max-width:1100px;margin:0 auto}.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px;margin-bottom:14px}
    .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}h3{margin:0;font-size:14px}h4{margin:16px 0 6px;font-size:13px}
    .btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}.btn:disabled{opacity:.5;cursor:default}
    .new{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}.new input{padding:7px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit;flex:1;min-width:140px}
    .field{margin-bottom:10px}.field label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}
    .cols2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    input,select,textarea{width:100%;box-sizing:border-box;padding:7px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit;font-size:13px}
    textarea{resize:vertical}
    .chk{display:flex;gap:6px;align-items:center;font-size:13px;margin:4px 0 10px}
    .chk input{width:auto}
    .acts{display:flex;gap:8px;align-items:center;margin-bottom:6px}
    .badge{font-size:11px;background:#eee;border-radius:10px;padding:2px 8px}.badge.on{background:#d9f2e4;color:#1a7f4b}
    .mini{font-size:11px;padding:3px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .runout{margin-top:10px;padding:8px;background:#f0f6ff;border-radius:8px;font-size:13px;white-space:pre-wrap}
    .muted{color:var(--muted,#888);font-size:12px}table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:6px 8px;border-bottom:1px solid var(--border,#f0f0f0);text-align:left}
  `]
})
export class AutomationComponent implements OnInit {
  studio = inject(AiStudioService);
  popup = inject(PopupService);
  providers = PROVIDERS;
  agents: Agent[] = []; workflows: Workflow[] = []; schedules: Schedule[] = []; entities: StudioEntity[] = [];
  showAgent = false; showWf = false; aName=''; aPurpose=''; wName=''; wCron=''; cronExpr='0 9 * * 1-5';
  schedWf?: Workflow; lastRun?: any; lastExec?: any;

  agentsPage = 1; agentsPageSize = 25; agentsTotal = 0; agentsLoading = false;
  wfPage = 1; wfPageSize = 25; wfTotal = 0; wfLoading = false;
  schedPage = 1; schedPageSize = 25; schedTotal = 0; schedLoading = false;
  execPage = 1; execPageSize = 25; execsTotal = 0; execsLoading = false;

  agentsGrid: any = {
    header: { title: 'AI Agents', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'purpose', headerName: 'Purpose' },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: string) => v === 'active' ? 'ok' : '' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Console', run: (a: Agent) => this.openConsole(a) },
        { label: (a: Agent) => a.status === 'active' ? 'Pause' : 'Activate', run: (a: Agent) => this.toggleAgent(a) },
      ] },
    ],
  };
  wfGrid: any = {
    header: { title: 'Workflows', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'version', headerName: 'Version' },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: string) => v === 'active' ? 'ok' : '' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Activate', run: (w: Workflow) => this.studio.activateWorkflow(w.id).subscribe(() => this.load()) },
        { label: 'Run now', run: (w: Workflow) => this.runWf(w) },
        { label: 'Logs', run: (w: Workflow) => this.openLogs(w) },
        { label: 'Schedule', when: (w: Workflow) => w.status === 'active', run: (w: Workflow) => this.schedWf = w },
      ] },
    ],
  };
  execGrid: any = {
    header: { title: 'Executions', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'startedAt', headerName: 'Started', cellFn: (e: Exec) => new Date(e.startedAt).toLocaleString() },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: execTone },
      { field: 'error', headerName: 'Error', cellFn: (e: Exec) => e.error || '—' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Retry step', class: 'primary', when: (e: Exec) => e.status === 'failed', run: (e: Exec) => this.retry(e) },
      ] },
    ],
  };
  schedGrid: any = {
    header: { title: 'Schedules', desc: null, add: false, refresh: true, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'cron', headerName: 'Cron' },
      { field: 'enabled', headerName: 'Enabled', cellFn: (s: Schedule) => s.enabled ? '✓' : '—' },
      { field: 'nextRunAt', headerName: 'Next run', cellFn: (s: Schedule) => s.nextRunAt ? new Date(s.nextRunAt).toLocaleString() : '—' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Toggle', run: (s: Schedule) => this.studio.toggleSchedule(s.id).subscribe(() => this.loadSched()) },
        { label: 'Del', class: 'danger', run: (s: Schedule) => this.studio.deleteSchedule(s.id).subscribe(() => this.loadSched()) },
      ] },
    ],
  };

  ngOnInit() {
    this.load(); this.loadSched();
    this.studio.listEntities().subscribe(e => this.entities = e);
  }
  load() {
    this.agentsLoading = true;
    this.studio.listAgents(this.agentsPage, this.agentsPageSize).subscribe({
      next: p => { this.agents = p.items; this.agentsTotal = p.totalCount; this.agentsLoading = false; },
      error: () => this.agentsLoading = false,
    });
    this.wfLoading = true;
    this.studio.listWorkflows(this.wfPage, this.wfPageSize).subscribe({
      next: p => { this.workflows = p.items; this.wfTotal = p.totalCount; this.wfLoading = false; },
      error: () => this.wfLoading = false,
    });
  }
  loadSched() {
    this.schedLoading = true;
    this.studio.listSchedules(this.schedPage, this.schedPageSize).subscribe({
      next: p => { this.schedules = p.items; this.schedTotal = p.totalCount; this.schedLoading = false; },
      error: () => this.schedLoading = false,
    });
  }
  onAgentsPage(e: { skip: number; take: number }) { this.agentsPageSize = e.take; this.agentsPage = Math.floor(e.skip / e.take) + 1; this.load(); }
  onWfPage(e: { skip: number; take: number }) { this.wfPageSize = e.take; this.wfPage = Math.floor(e.skip / e.take) + 1; this.load(); }
  onSchedPage(e: { skip: number; take: number }) { this.schedPageSize = e.take; this.schedPage = Math.floor(e.skip / e.take) + 1; this.loadSched(); }
  onExecPage(e: { skip: number; take: number }) { this.execPageSize = e.take; this.execPage = Math.floor(e.skip / e.take) + 1; this.loadExecs(); }
  toggleAgent(a: Agent) {
    this.studio.setAgentStatus(a.id, a.status === 'active' ? 'pause' : 'activate').subscribe(() => this.load());
  }

  // ── agent console (US-6.1) ───────────────────────────────────────
  consoleAgent?: Agent; agentLogs: any[] = [];
  cName = ''; cPurpose = ''; cProvider = 'gemini'; cGuardrails = ''; cCitations = false;
  dryRunEntityId = ''; dryRunInput = ''; dryRunOut = '';

  private parseCfg(a: Agent): any { try { return JSON.parse(a.configJson || '{}'); } catch { return {}; } }
  openConsole(a: Agent) {
    this.consoleAgent = a;
    const cfg = this.parseCfg(a);
    this.cName = a.name; this.cPurpose = a.purpose;
    this.cProvider = cfg.provider ?? 'gemini';
    this.cCitations = !!cfg.enforceCitations;
    this.cGuardrails = Array.isArray(cfg.guardrails) ? cfg.guardrails.join('\n') : (cfg.guardrails ?? '');
    this.dryRunEntityId = ''; this.dryRunInput = ''; this.dryRunOut = '';
    this.loadAgentLogs();
  }
  loadAgentLogs() {
    if (!this.consoleAgent) return;
    this.studio.listAgentRuns(this.consoleAgent.id).subscribe({ next: p => this.agentLogs = p.items, error: () => this.agentLogs = [] });
  }
  saveConsole() {
    if (!this.consoleAgent) return;
    const cfg = {
      provider: this.cProvider,
      enforceCitations: this.cCitations,
      guardrails: this.cGuardrails.split('\n').map(s => s.trim()).filter(Boolean),
    };
    this.studio.updateAgent(this.consoleAgent.id, this.cName, this.cPurpose, JSON.stringify(cfg)).subscribe(a => {
      this.consoleAgent = a; this.load();
    });
  }
  prefillDryRun() {
    const e = this.entities.find(x => x.id === this.dryRunEntityId);
    if (e) this.dryRunInput = `Qualify ${e.name} (${e.classification}) — stage ${e.stage}, source ${e.source}, evidence: ${e.evidenceJson}`;
  }
  dryRun() {
    if (!this.consoleAgent || !this.dryRunInput.trim()) return;
    this.studio.runAgent(this.consoleAgent.id, this.dryRunInput.trim()).subscribe(r => {
      this.dryRunOut = r.output || '(no output)';
      this.lastRun = r;
      this.loadAgentLogs();
    });
  }

  // ── workflow execution logs (US-7.1) ─────────────────────────────
  logsWf?: Workflow; execs: Exec[] = [];
  openLogs(w: Workflow) { this.logsWf = w; this.execPage = 1; this.loadExecs(); }
  loadExecs() {
    if (!this.logsWf) return;
    this.execsLoading = true;
    this.studio.listExecutions(this.logsWf.id, this.execPage, this.execPageSize).subscribe({
      next: p => { this.execs = p.items; this.execsTotal = p.totalCount; this.execsLoading = false; },
      error: () => this.execsLoading = false,
    });
  }
  retry(e: Exec) {
    this.studio.retryExecution(e.id).subscribe(() => {
      setTimeout(() => this.loadExecs(), 1200);
    });
  }

  openAgent() {
    const popup = { header: { text: 'New agent' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(AgentPopupComponent, popup, { id: null, data: {}, actionType: 'Show' }).then(() => this.load()).catch(() => this.load());
  }
  builderWf: Workflow | null = null; builderJson = '';
  toggleBuilder() {
    if (this.builderWf) { this.builderWf = null; return; }
    const w = this.workflows[0]; if (w) this.openBuilder(w);
  }
  openBuilder(w: Workflow) { this.builderWf = w; this.builderJson = w.definitionJson; }
  saveBuilder() { if (this.builderWf) this.studio.updateWorkflow(this.builderWf.id, this.builderWf.name, this.builderJson).subscribe(() => this.load()); }
  openWf() {
    const popup = { header: { text: 'New workflow' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(WorkflowPopupComponent, popup, { id: null, data: {}, actionType: 'Show' }).then(() => { this.load(); this.loadSched(); }).catch(() => { this.load(); this.loadSched(); });
  }
  runAgent(a: Agent) {
    const input = prompt('Input for agent run:', 'Qualify new inbound lead');
    if (input) this.studio.runAgent(a.id, input).subscribe(r => this.lastRun = r);
  }
  runWf(w: Workflow) {
    this.studio.executeWorkflow(w.id).subscribe(e => {
      this.lastExec = e;
      // execution is processed by the durable worker; refresh shortly to surface the final result
      setTimeout(() => this.studio.listExecutions(w.id).subscribe(x => { if (x.items?.length) this.lastExec = x.items[0]; }), 1500);
    });
  }
  get execSteps(): any[] { try { return JSON.parse(this.lastExec?.resultJson || '{}').steps ?? []; } catch { return []; } }
  addSchedule() {
    if (this.schedWf) this.studio.createSchedule(this.schedWf.id, this.cronExpr).subscribe(() => { this.loadSched(); this.schedWf = undefined; });
  }
}
