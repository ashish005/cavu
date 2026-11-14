import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService, Agent, Workflow, Schedule } from '../ai-studio.service';
import { PopupService, ASIDE_CLASS, ASIDE_SIZE } from '@app-global';
import { AgentPopupComponent } from '../popups/agent-popup.component';
import { WorkflowPopupComponent } from '../popups/workflow-popup.component';

@Component({
  selector: 'app-automation',
  standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="auto">
    <div class="cols">
      <section class="card">
        <div class="hd"><h3>AI Agents</h3><button class="btn" (click)="openAgent()">+ New</button></div>

        <div class="item" *ngFor="let a of agents">
          <div><b>{{ a.name }}</b><small>{{ a.purpose }}</small></div>
          <div class="acts">
            <span class="badge" [class.on]="a.status==='active'">{{ a.status }}</span>
            <button class="mini" (click)="a.status==='active'?studio.setAgentStatus(a.id,'pause').subscribe(load):studio.setAgentStatus(a.id,'activate').subscribe(load)">{{ a.status==='active'?'Pause':'Activate' }}</button>
            <button class="mini" (click)="runAgent(a)">Run</button>
          </div>
        </div>
        <p class="muted" *ngIf="!agents.length">No agents.</p>
        <div class="runout" *ngIf="lastRun"><b>Last run:</b> {{ lastRun.output }}</div>
      </section>

      <section class="card">
        <div class="hd"><h3>Workflows</h3><button class="btn" (click)="openWf()">+ New</button></div>

        <div class="item" *ngFor="let w of workflows">
          <div><b>{{ w.name }}</b><small>v{{ w.version }} · {{ w.status }}</small></div>
          <div class="acts">
            <button class="mini" (click)="studio.activateWorkflow(w.id).subscribe(load)">Activate</button>
            <button class="mini" (click)="runWf(w)">Run now</button>
            <button class="mini" *ngIf="w.status==='active'" (click)="schedWf=w">Schedule</button>
          </div>
        </div>
        <p class="muted" *ngIf="!workflows.length">No workflows.</p>
        <div class="runout" *ngIf="lastExec">Execution: <b>{{ lastExec.status }}</b> {{ lastExec.error || '' }}</div>
      </section>
    </div>

    <section class="card" *ngIf="schedWf">
      <div class="hd"><h3>Schedule: {{ schedWf.name }}</h3><button class="btn" (click)="schedWf=null">✕</button></div>
      <div class="new"><input [(ngModel)]="cronExpr" placeholder="cron (min hour dom mon dow)"/>
        <button class="btn primary" (click)="addSchedule()">Add schedule</button></div>
      <table><thead><tr><th>Cron</th><th>Enabled</th><th>Next run</th><th></th></tr></thead>
      <tbody><tr *ngFor="let s of schedules"><td>{{ s.cron }}</td><td>{{ s.enabled?'✓':'—' }}</td><td>{{ s.nextRunAt|date:'short' }}</td>
        <td><button class="mini" (click)="studio.toggleSchedule(s.id).subscribe(loadSched)">Toggle</button>
            <button class="mini" (click)="studio.deleteSchedule(s.id).subscribe(loadSched)">Del</button></td></tr></tbody></table>
    </section>
  </div>`,
  styles: [`
    .auto{padding:16px;max-width:1100px;margin:0 auto}.cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px;margin-bottom:14px}
    .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}h3{margin:0;font-size:14px}
    .btn{padding:5px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .btn.primary{background:#3467d6;color:#fff;border-color:#3467d6}
    .new{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}.new input{padding:7px;border-radius:6px;border:1px solid var(--border,#ddd);background:inherit;color:inherit;flex:1;min-width:140px}
    .item{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid var(--border,#f0f0f0)}
    .item small{display:block;color:var(--muted,#888)}.acts{display:flex;gap:6px;align-items:center}
    .badge{font-size:11px;background:#eee;border-radius:10px;padding:2px 8px}.badge.on{background:#d9f2e4;color:#1a7f4b}
    .mini{font-size:11px;padding:3px 8px;border-radius:8px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .runout{margin-top:10px;padding:8px;background:#f0f6ff;border-radius:8px;font-size:13px}
    .muted{color:var(--muted,#888);font-size:12px}table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:6px 8px;border-bottom:1px solid var(--border,#f0f0f0);text-align:left}
  `]
})
export class AutomationComponent implements OnInit {
  studio = inject(AiStudioService);
  popup = inject(PopupService);
  agents: Agent[] = []; workflows: Workflow[] = []; schedules: Schedule[] = [];
  showAgent = false; showWf = false; aName=''; aPurpose=''; wName=''; wCron=''; cronExpr='0 9 * * 1-5';
  schedWf?: Workflow; lastRun?: any; lastExec?: any;
  ngOnInit() { this.load(); this.loadSched(); }
  load() {
    this.studio.listAgents().subscribe(a => this.agents = a);
    this.studio.listWorkflows().subscribe(w => this.workflows = w);
  }
  loadSched() { this.studio.listSchedules().subscribe(s => this.schedules = s); }
  openAgent() {
    const popup = { header: { text: 'New agent' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(AgentPopupComponent, popup, { id: null, data: {}, actionType: 'Show' }).then(() => this.load()).catch(() => this.load());
  }
  openWf() {
    const popup = { header: { text: 'New workflow' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
    this.popup.showCustomPopup(WorkflowPopupComponent, popup, { id: null, data: {}, actionType: 'Show' }).then(() => { this.load(); this.loadSched(); }).catch(() => { this.load(); this.loadSched(); });
  }
  runAgent(a: Agent) {
    const input = prompt('Input for agent run:', 'Qualify new inbound lead');
    if (input) this.studio.runAgent(a.id, input).subscribe(r => this.lastRun = r);
  }
  runWf(w: Workflow) { this.studio.executeWorkflow(w.id).subscribe(e => this.lastExec = e); }
  addSchedule() {
    if (this.schedWf) this.studio.createSchedule(this.schedWf.id, this.cronExpr).subscribe(() => { this.loadSched(); this.schedWf = undefined; });
  }
}
