import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService } from '../ai-studio.service';
import { StudioRowActionsCell, StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

type Tab = 'industry' | 'integrations' | 'agency' | 'analytics' | 'backlog';

/** Route 7 — Settings & Analytics: industry config, integrations, agency, attribution, backlog. */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TableComponent, PaginationComponent],
  template: `
  <div>
    <div class="page-head">
      <div><h1>Settings &amp; Analytics</h1><p class="sub">Workspace configuration, integrations, agency clients & backlog</p></div>
      <div class="tabs">
        <button *ngFor="let t of tabs" class="chip" [class.on]="tab===t.key" (click)="tab=t.key">{{ t.label }}</button>
      </div>
    </div>

    <!-- 7.1 industry config -->
    <div class="cols" *ngIf="tab==='industry'">
      <section class="card">
        <h3>Industry: {{ studio.industry?.label }}</h3>
        <div class="field"><label>Switch industry</label>
          <select [(ngModel)]="indKey" (change)="switchIndustry()">
            <option *ngFor="let i of studio.industryList" [value]="i.key">{{ i.label }}</option></select></div>
        <h3 style="margin-top:16px">Pipeline stages</h3>
        <div class="stage-list"><span class="badge info" *ngFor="let s of studio.industry?.stages; let i=index">{{ i+1 }}. {{ s }}</span></div>
        <p class="muted">Stages are backend-driven per industry — switching industry reloads routes, metrics & stage definitions.</p>

        <h3 style="margin-top:18px">Capabilities</h3>
        <label class="cap" *ngFor="let c of capList">
          <input type="checkbox" [checked]="isCapOn(c.key)" (change)="toggleCap(c.key)"/> {{ c.label }}
        </label>
        <p class="muted">Toggle Discovery, Intelligence, Voice Ops, Scheduling & Compliance Guardrails per vertical — no code change needed.</p>
      </section>
      <section class="card">
        <h3>Qualification gate & weights</h3>
        <div class="field"><label>Qualification gate ({{ gate }}%)</label>
          <input type="range" min="50" max="95" [(ngModel)]="gate" (change)="saveScoring()" style="width:100%"/></div>
        <div class="field" *ngFor="let w of weightKeys"><label>{{ w }} ({{ weights[w.key] }}%)</label>
          <input type="range" min="5" max="60" [(ngModel)]="weights[w.key]" (change)="saveScoring()" style="width:100%"/></div>
        <p class="muted">Weights auto-normalize; entities below the gate show as Watchlist.</p>
      </section>
    </div>

    <!-- 7.2 integrations -->
    <section class="card" *ngIf="tab==='integrations'">
      <h3>Provider integrations</h3>
      <p class="muted">Connect external tools with scoped permissions. Connected providers make live calls; otherwise the platform simulates.</p>
      <div class="prov-grid">
        <div class="prov" *ngFor="let p of providers">
          <div class="p-head"><b>{{ p.label }}</b><span class="badge" [class.ok]="p.live">{{ p.live ? 'CONNECTED' : 'DISCONNECTED' }}</span></div>
          <small class="muted">{{ p.kind }} · {{ p.model || '—' }}</small>
          <div class="scopes"><span class="scope" *ngFor="let s of scopes(p)">{{ s }}</span></div>
          <button class="btn" [class.primary]="!p.live" (click)="toggleProvider(p)">{{ p.live ? 'Disconnect' : 'Connect' }}</button>
        </div>
      </div>
      <h3 style="margin-top:16px">Webhook endpoints</h3>
      <org-grid [data]="hooks" [options]="hooksGrid" [isLoading]="hooksLoading"></org-grid>
      <org-grid-pagination [page]="hooksPage" [count]="hooksTotal" [perPage]="hooksPageSize" [loading]="hooksLoading" (cb)="onHooksPage($event)"></org-grid-pagination>
    </section>

    <!-- 7.3 agency clients -->
    <section class="card" *ngIf="tab==='agency'">
      <h3>Agency clients</h3>
      <org-grid [data]="clients" [options]="clientsGrid" [isLoading]="clientsLoading"></org-grid>
      <org-grid-pagination [page]="clientsPage" [count]="clientsTotal" [perPage]="clientsPageSize" [loading]="clientsLoading" (cb)="onClientsPage($event)"></org-grid-pagination>
    </section>

    <!-- 7.4 attribution analytics -->
    <section class="card" *ngIf="tab==='analytics'">
      <h3>Source attribution</h3>
      <p class="muted">Per-source yield & cost-per-qualified, so budget flows to top-performing channels.</p>
      <table><thead><tr><th>Source</th><th>Discovered</th><th>Qualified</th><th>Yield</th><th>Avg score</th><th>Est. spend</th><th>Cost / qualified</th></tr></thead>
        <tbody><tr *ngFor="let r of sourceRoi">
          <td>{{ r.source }}</td><td>{{ r.discovered }}</td><td>{{ r.qualified }}</td>
          <td>{{ r.yield }}%</td><td>{{ r.avgScore }}</td><td>{{ money(r.estimatedSpend) }}</td><td><b>{{ money(r.costPerQualified) }}</b></td>
        </tr></tbody></table>
      <p class="muted" *ngIf="!sourceRoi.length">No source data yet — run a discovery to populate attribution.</p>
      <a class="btn" style="margin-top:12px;display:inline-block" [routerLink]="['../analytics']" [relativeTo]="route">Open full Analytics →</a>
    </section>

    <!-- 7.5 backlog -->
    <section class="card" *ngIf="tab==='backlog'">
      <h3>Product backlog <span class="muted">{{ backlog.count }} items</span></h3>
      <div class="filters">
        <button class="btn" (click)="exportCsv()">Download CSV</button>
        <button class="btn" (click)="exportXlsx()">Download Excel</button>
      </div>
      <table><thead><tr><th>ID</th><th>Type</th><th>Title</th><th>Priority</th><th>Status</th></tr></thead>
        <tbody><tr *ngFor="let r of backlog.rows | slice:0:50">
          <td>{{ r['Story ID'] || r['Task ID'] || r['Epic ID'] || '—' }}</td>
          <td><span class="badge info">{{ r['Type'] || '—' }}</span></td>
          <td>{{ r['Title'] || r['User Story'] || '—' }}</td>
          <td>{{ r['Priority'] || '—' }}</td><td>{{ r['Status'] || '—' }}</td>
        </tr></tbody></table>
    </section>
  </div>`,
  styles: [`
    .tabs{display:flex;gap:6px;flex-wrap:wrap}.stage-list{display:flex;flex-direction:column;gap:6px;margin-top:8px}
    .field{margin-bottom:12px}.field label{display:block;font-size:12px;font-weight:600;margin-bottom:4px}
    input[type=range]{accent-color:#3467d6}
    .item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--st-border,#e6e9f2)}
    .item small{display:block;color:var(--st-muted,#6b7690)}
    .prov-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-top:8px}
    .prov{border:1px solid var(--st-border,#e6e9f2);border-radius:10px;padding:10px}
    .p-head{display:flex;justify-content:space-between;align-items:center}
    .cap{display:flex;gap:8px;align-items:center;font-size:13px;padding:4px 0;cursor:pointer}
    .cap input{width:auto}
    .scopes{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0}
    .scope{font-size:10px;background:#eef1f8;border-radius:8px;padding:2px 7px;color:#475569}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:8px;border-bottom:1px solid var(--st-border,#e6e9f2);text-align:left}
    .filters{display:flex;gap:8px;margin-bottom:12px}
  `]
})
export class SettingsComponent implements OnInit {
  studio = inject(AiStudioService); route = inject(ActivatedRoute);
  tab: Tab = 'industry';
  tabs = [
    { key: 'industry', label: 'Industry Config' }, { key: 'integrations', label: 'Integrations' },
    { key: 'agency', label: 'Agency Clients' }, { key: 'analytics', label: 'Attribution' }, { key: 'backlog', label: 'Backlog' },
  ] as { key: Tab; label: string }[];
  indKey = ''; gate = 80;
  weights: any = { signal: 30, capacity: 25, urgency: 25, reachability: 20 };
  weightKeys = [
    { key: 'signal', label: 'Buying / Tech Signal' }, { key: 'capacity', label: 'Financial Capacity' },
    { key: 'urgency', label: 'Hiring / Timing Urgency' }, { key: 'reachability', label: 'Contact Reachability' },
  ];
  providers: any[] = []; hooks: any[] = []; clients: any[] = []; sourceRoi: any[] = [];
  capList = [
    { key: 'discovery', label: 'Discovery' }, { key: 'intelligence', label: 'Intelligence' },
    { key: 'voice-ops', label: 'Voice Ops' }, { key: 'scheduling', label: 'Scheduling' },
    { key: 'compliance-guardrails', label: 'Compliance Guardrails' },
  ];
  private enabledCaps = new Set<string>();
  backlog: any = { headers: [], rows: [], count: 0 };
  hooksPage = 1; hooksPageSize = 25; hooksTotal = 0; hooksLoading = false;
  clientsPage = 1; clientsPageSize = 25; clientsTotal = 0; clientsLoading = false;
  hooksGrid: any = {
    header: { title: 'Webhook endpoints', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'url', headerName: 'Url' },
      { field: 'eventsJson', headerName: 'Events' },
      { field: 'isActive', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v ? 'ok' : '' },
    ],
  };
  clientsGrid: any = {
    header: { title: 'Agency clients', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Client' },
      { field: 'industryKey', headerName: 'Industry' },
      { field: 'activeAgents', headerName: 'Agents' },
      { field: 'qualifiedMtd', headerName: 'Qualified (MTD)' },
      { headerName: 'Spend/mo', cellFn: (c: any) => '$' + c.monthlySpend },
      { field: 'health', headerName: 'Health', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v === 'Nominal' ? 'ok' : 'warn' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [
        { label: 'Enter workspace', run: (c: any) => this.enterClient(c) },
      ] },
    ],
  };

  ngOnInit() {
    this.indKey = this.studio.industry?.key ?? '';
    this.enabledCaps = new Set(this.studio.industry?.capabilities ?? []);
    this.studio.getScoring().subscribe(s => { this.gate = s.gateThreshold; Object.assign(this.weights, s.weights); });
    this.studio.listProviders().subscribe(p => this.providers = p);
    this.studio.listHooks(this.hooksPage, this.hooksPageSize).subscribe(p => { this.hooks = p.items; this.hooksTotal = p.totalCount; });
    this.studio.listAgencyClients(this.clientsPage, this.clientsPageSize).subscribe(p => { this.clients = p.items; this.clientsTotal = p.totalCount; });
    this.studio.listSourceRoi().subscribe(r => this.sourceRoi = r);
    this.studio.getBacklog().subscribe(b => this.backlog = b);
  }
  onHooksPage(e: { skip: number; take: number }) { this.hooksPageSize = e.take; this.hooksPage = Math.floor(e.skip / e.take) + 1; this.studio.listHooks(this.hooksPage, this.hooksPageSize).subscribe(p => { this.hooks = p.items; this.hooksTotal = p.totalCount; }); }
  onClientsPage(e: { skip: number; take: number }) { this.clientsPageSize = e.take; this.clientsPage = Math.floor(e.skip / e.take) + 1; this.studio.listAgencyClients(this.clientsPage, this.clientsPageSize).subscribe(p => { this.clients = p.items; this.clientsTotal = p.totalCount; }); }
  saveScoring() { this.studio.putScoring(this.gate, this.weights).subscribe(); }
  switchIndustry() { this.studio.setIndustry(this.indKey); this.enabledCaps = new Set(this.studio.industry?.capabilities ?? []); }
  isCapOn(key: string) { return this.enabledCaps.has(key); }
  toggleCap(key: string) {
    if (this.enabledCaps.has(key)) this.enabledCaps.delete(key); else this.enabledCaps.add(key);
    const caps = this.capList.filter(c => this.enabledCaps.has(c.key)).map(c => c.key);
    this.studio.updateIndustryCapabilities(this.indKey, caps).subscribe(() => this.studio.loadConfig().subscribe());
  }
  scopes(p: any) { return p.tasks ?? []; }
  money(v: any) { return '$' + (v ?? 0); }
  toggleProvider(p: any) {
    if (p.live) {
      this.studio.deleteCredential(p.key).subscribe(() => this.studio.listProviders().subscribe(x => this.providers = x));
    } else {
      this.studio.connectProvider(p.key).subscribe(() => this.studio.listProviders().subscribe(x => this.providers = x));
    }
  }
  enterClient(c: any) {
    // agency override: switch workspace+industry context to the client, with an exit banner
    this.studio.enterClientOverride(c.name, 'business-workspace', c.industryKey);
  }
  exportCsv() {
    const rows = [this.backlog.headers, ...this.backlog.rows.map((r: any) => this.backlog.headers.map((h: string) => r[h] ?? ''))];
    download(rows.map(r => r.join(',')).join('\n'), 'enrator_backlog.csv', 'text/csv');
  }
  exportXlsx() {
    // lightweight multi-sheet CSV fallback (xlsx via SheetJS if available)
    const summary = [['Epic','Stories','Tasks'], ...groupCounts(this.backlog.rows)];
    download(summary.map(r => r.join(',')).join('\n'), 'enrator_backlog_sprints.csv', 'text/csv');
  }
}
function groupCounts(rows: any[]) {
  const m: Record<string, number[]> = {};
  rows.forEach(r => { const k = r['Sprint'] || 'Unassigned'; (m[k] ??= [0,0,0]); const t = r['Type']||''; if(t.includes('Epic'))m[k][0]++; else if(t.includes('Story'))m[k][1]++; else m[k][2]++; });
  return Object.entries(m).map(([k,v]) => [k, ...v.map(String)]);
}
function download(content: string, name: string, type: string) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click();
}
