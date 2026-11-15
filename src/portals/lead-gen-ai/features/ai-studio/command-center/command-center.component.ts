import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AiStudioService, StudioEntity, Run, Thread } from '../ai-studio.service';

type Win = 7 | 14 | 30;

/** Command Center — spec: context header, 4 KPI cards, dual-line velocity chart, handoff triage, priority records. */
@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="cc">
    <div class="loading" *ngIf="loading">Loading command center…</div>
    <!-- A: header -->
    <div class="cc-head">
      <div>
        <h1>{{ headerTitle }}</h1>
        <p class="sub">{{ headerSub }}</p>
      </div>
      <span class="aud">{{ audience }}</span>
    </div>

    <!-- B: KPI strip -->
    <div class="kpis">
      <div class="kpi"><div class="k-top"><span class="k-label">Records Discovered ({{ win }}d)</span></div>
        <div class="k-value">{{ discovered }}</div><div class="k-sub ok">{{ runs.length }} runs</div></div>
      <div class="kpi"><div class="k-top"><span class="k-label">Evidence-Verified Qualified</span></div>
        <div class="k-value">{{ qualified }}</div><div class="k-sub ok">{{ yieldPct }}% yield</div></div>
      <div class="kpi"><div class="k-top"><span class="k-label">AI Agent Executions (24h)</span></div>
        <div class="k-value">{{ kpis.agentExec24h ?? 0 }}</div><div class="k-sub">{{ kpis.agentsActive ?? 0 }}/{{ kpis.agentsTotal ?? 0 }} active</div></div>
      <div class="kpi"><div class="k-top"><span class="k-label">Human Handoffs Pending</span></div>
        <div class="k-value">{{ handoffs }}</div>
        <div class="k-sub" [class.warn]="handoffs>0" [class.ok]="handoffs===0">{{ handoffs>0?'Needs review':'All clear' }}</div></div>
    </div>

    <!-- C: chart + handoffs -->
    <div class="split">
      <section class="card">
        <div class="ch-head">
          <div><h3>Discovery &amp; Qualification Velocity</h3><p class="muted">Multi-source intake vs. evidence-verified outcomes</p></div>
          <div class="legend"><span class="dot slate"></span>Discovered <span class="dot blue"></span>Qualified</div>
          <div class="seg">
            <button *ngFor="let w of windows" class="seg-btn" [class.on]="win===w" (click)="setWin(w)">{{ w }}d</button>
          </div>
        </div>
        <svg viewBox="0 0 680 200" class="chart" (mouseleave)="hover=-1">
          <g *ngFor="let g of gridY"><line [attr.x1]="30" [attr.x2]="670" [attr.y1]="g.y" [attr.y2]="g.y" stroke="#eef2f7"/><text x="4" [attr.y]="g.y+4" font-size="9" fill="#94a3b8">{{ g.v }}</text></g>
          <path [attr.d]="pathD0" fill="none" stroke="#94A3B8" stroke-width="2"/>
          <path [attr.d]="pathD1" fill="none" stroke="#2563EB" stroke-width="2"/>
          <g *ngFor="let p of points; let i=index">
            <rect [attr.x]="p.x-14" y="10" width="28" height="180" fill="transparent" (mouseenter)="hover=i"/>
            <circle *ngIf="hover===i" [attr.cx]="p.x" [attr.cy]="p.y0" r="4" fill="#94A3B8"/>
            <circle *ngIf="hover===i" [attr.cx]="p.x" [attr.cy]="p.y1" r="4" fill="#2563EB"/>
          </g>
        </svg>
        <div class="readout" *ngIf="hover>=0 && hoverPoint">
          <span>{{ hoverPoint.label }}</span>
          <span>Discovered: {{ hoverPoint.d }} · Qualified: {{ hoverPoint.q }} ({{ hoverPoint.pct }}%)</span>
        </div>
      </section>

      <section class="card">
        <div class="ch-head"><h3>Conversations &amp; Handoffs</h3><a class="lnk" (click)="go('inbox')">Open Inbox →</a></div>
        <div class="q-item" *ngFor="let t of topThreads">
          <div class="q-top"><b>{{ entityName(t.entityId) || t.subject }}</b>
            <span class="badge" [class.warn]="mode(t)==='Human Handoff Required'" [class.info]="mode(t)==='Human Active'" [class.ok]="mode(t)==='AI Autonomous'">{{ mode(t) }}</span></div>
          <div class="muted">{{ t.contactName || 'Contact' }} · {{ t.channel }} · {{ t.lastActivityAt || t.createdAt | date:'MMM d, h:mm a' }}</div>
          <div class="q-acts">
            <button class="mini" (click)="openThread(t)">{{ mode(t)==='Human Handoff Required' ? 'Take Over' : 'View Thread' }} →</button>
            <button class="mini" (click)="inspect(t.entityId)">Inspect Evidence</button>
          </div>
        </div>
        <p class="muted" *ngIf="!topThreads.length">No conversations yet.</p>
      </section>
    </div>

    <!-- D: priority records -->
    <section class="card">
      <div class="ch-head"><h3>Priority Records</h3><a class="lnk" (click)="go('entities')">View All Entities →</a></div>
      <table><thead><tr><th>Entity</th><th>Type</th><th>Source</th><th>Stage</th><th class="r">Confidence</th><th></th></tr></thead>
        <tbody><tr *ngFor="let e of priorityEntities">
          <td><b>{{ e.name }}</b><div class="muted">{{ e.classification }} · {{ e.source }}</div></td>
          <td>{{ e.classification }}</td><td>{{ e.source }}</td><td>{{ e.stage }}</td>
          <td class="r mono">{{ e.score }}/100</td>
          <td class="r"><button class="mini" (click)="inspect(e.id)">Inspect Dossier</button></td>
        </tr></tbody></table>
      <p class="muted" *ngIf="!priorityEntities.length">No entities yet — run discovery or load demo data.</p>
    </section>
  </div>`,
  styles: [`
    .cc{padding:0 4px}.loading{padding:40px;text-align:center;color:#64748b}.cc-head{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:14px;border-bottom:1px solid #e2e8f0;margin-bottom:18px}
    .cc-head h1{margin:0;font-size:22px}.sub{color:#64748b;font-size:13px;margin:4px 0 0}
    .aud{background:#eef2ff;color:#4338ca;font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px}
    .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
    .kpi{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;background:#fff}
    .k-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:600}
    .k-value{font-size:26px;font-weight:700;font-variant-numeric:tabular-nums;margin:6px 0 2px}
    .k-sub{font-size:12px;color:#64748b}.k-sub.ok{color:#059669}.k-sub.warn{color:#d97706}
    .split{display:grid;grid-template-columns:7fr 5fr;gap:14px;margin-bottom:18px}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px}
    .ch-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:10px}
    .ch-head h3{margin:0;font-size:15px}.muted{color:#64748b;font-size:12px}
    .legend{font-size:11px;color:#64748b;display:flex;align-items:center;gap:6px}
    .dot{width:9px;height:9px;border-radius:50%;display:inline-block}
    .dot.slate{background:#94A3B8}.dot.blue{background:#2563EB}
    .seg{display:flex;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
    .seg-btn{border:0;background:#fff;padding:5px 12px;font-size:12px;cursor:pointer;color:#64748b}
    .seg-btn.on{background:#1e293b;color:#fff}
    .chart{width:100%;height:200px}
    .readout{display:flex;justify-content:space-between;background:#0f172a;color:#fff;border-radius:8px;padding:8px 14px;font-size:12px;margin-top:6px;font-variant-numeric:tabular-nums}
    .lnk{color:#2563EB;font-size:12px;cursor:pointer;font-weight:600}
    .q-item{border:1px solid #eef2f7;border-radius:10px;padding:10px 12px;margin-bottom:8px}
    .q-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px}
    .q-acts{display:flex;gap:8px;margin-top:8px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    td,th{padding:9px 8px;border-bottom:1px solid #f1f5f9;text-align:left}
    .r{text-align:right}.mono{font-variant-numeric:tabular-nums}
    .mini{padding:4px 10px;border-radius:6px;border:1px solid #cbd5e1;background:#fff;font-size:12px;cursor:pointer}
    .mini:hover{border-color:#2563EB;color:#2563EB}
    .badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:10px;text-transform:uppercase}
    .badge.ok{background:#d1fae5;color:#065f46}.badge.warn{background:#fef3c7;color:#92400e}.badge.info{background:#dbeafe;color:#1e40af}
    @media(max-width:1100px){.kpis{grid-template-columns:repeat(2,1fr)}.split{grid-template-columns:1fr}}
  `]
})
export class CommandCenterComponent implements OnInit {
  studio = inject(AiStudioService); router = inject(Router); route = inject(ActivatedRoute);
  kpis: any = { total: 0, qualified: 0, avgScore: 0, pendingBookings: 0, runs7d: 0 };
  runs: Run[] = []; threads: Thread[] = []; entities: StudioEntity[] = [];
  loading = false;
  win: Win = 14; readonly windows: Win[] = [7,14,30]; hover = -1;

  get ws() { return this.studio.workspace; }
  get isBiz() { return this.ws?.key === 'business-workspace'; }
  get headerTitle() { return this.isBiz ? `${this.studio.industry?.label ?? 'Industry'} Overview` : `${this.ws?.label ?? 'Workspace'} Overview`; }
  get headerSub() { return this.isBiz ? `Managing ${this.studio.industry?.label?.toLowerCase() ?? 'vertical'} discovery, qualification, and opportunity pipelines.` : (this.ws?.description ?? ''); }
  get audience() { return this.ws?.key === 'platform-admin' ? 'Platform Administrators' : this.ws?.key === 'agency-operations' ? 'Agency Teams' : 'Revenue & Growth Teams'; }

  // KPI computations
  discovered = 0; qualified = 0; yieldPct = 0; handoffs = 0;
  topThreads: Thread[] = []; priorityEntities: StudioEntity[] = [];
  private rebuild() {
    const d = Date.now() - this.win * 864e5;
    const wr = this.runs.filter(r => new Date(r.ranAt).getTime() > d);
    this.discovered = wr.reduce((s, r) => s + r.results, 0);
    this.qualified = wr.reduce((s, r) => s + (r.qualifiedCount ?? Math.round(r.results * 0.6)), 0);
    this.yieldPct = this.discovered ? Math.round((this.qualified / this.discovered) * 100) : 0;
    this.handoffs = this.kpis.handoffsPending ?? this.threads.filter(t => this.mode(t) === 'Human Handoff Required').length;
    this.topThreads = [...this.threads].sort((a, b) => (b.lastActivityAt ?? b.createdAt).localeCompare(a.lastActivityAt ?? a.createdAt)).slice(0, 3);
    this.priorityEntities = [...this.entities].sort((a, b) => b.score - a.score).slice(0, 8);
    this.rebuildSeries();
  }
  setWin(w: Win) { this.win = w; this.hover = -1; this.rebuild(); }

  // chart data — cached, rebuilt only when runs/window change
  series: { label: string; d: number; q: number }[] = [];
  points: { x: number; y0: number; y1: number; label: string; d: number; q: number; pct: number }[] = [];
  gridY: { v: number; y: number }[] = [];
  pathD0 = ''; pathD1 = '';
  maxV = 1;
  private rebuildSeries() {
    const days = this.win; const out: { label: string; d: number; q: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(); dt.setDate(dt.getDate() - i); const key = dt.toISOString().slice(0, 10);
      const rs = this.runs.filter(r => r.ranAt.slice(0, 10) === key);
      out.push({ label: dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), d: rs.reduce((s, r) => s + r.results, 0), q: rs.reduce((s, r) => s + (r.qualifiedCount ?? Math.round(r.results * 0.6)), 0) });
    }
    this.series = out;
    this.maxV = Math.max(...out.flatMap(s => [s.d, s.q]), 1);
    this.points = out.map((s, i) => ({
      x: 30 + (i / Math.max(out.length - 1, 1)) * 640,
      y0: 190 - (s.d / this.maxV) * 170, y1: 190 - (s.q / this.maxV) * 170, label: s.label, d: s.d, q: s.q,
      pct: s.d ? Math.round((s.q / s.d) * 100) : 0,
    }));
    this.gridY = [0, 60, 120, 180, 240].map(v => ({ v, y: 190 - (v / Math.max(this.maxV, 240)) * 170 }));
    this.pathD0 = this.mkPath('y0'); this.pathD1 = this.mkPath('y1');
  }
  private mkPath(key: 'y0' | 'y1') {
    const pts = this.points; if (!pts.length) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p[key]}`).join(' ');
  }
  get hoverPoint() { return this.hover >= 0 ? this.points[this.hover] : null; }
  mode(t: Thread) { return t.handlingMode ?? (t.status === 'open' ? 'AI Autonomous' : 'Human Handoff Required'); }
  entityName(id?: string) { return this.entities.find(e => e.id === id)?.name ?? ''; }
  go(path: string) { const ws = this.ws?.key ?? 'business-growth'; this.router.navigate([ws, path], { relativeTo: this.route.parent }); }
  openThread(t: Thread) { this.studio.pendingThreadId = t.id; this.go('inbox'); }
  inspect(id?: string) { if (id) { this.studio.pendingEntityId = id; this.go('entities'); } }

  ngOnInit() {
    this.loading = true;
    this.studio.kpis$.subscribe(k => { this.kpis = k; this.rebuild(); });
    this.studio.entities$.subscribe(e => { this.entities = e; this.rebuild(); });
    this.studio.runs$.subscribe(r => { this.runs = r; this.rebuild(); });
    this.studio.listThreads().subscribe({ next: p => { this.threads = p.items; this.rebuild(); this.loading = false; }, error: () => this.loading = false });
    this.studio.refreshAll();
  }
}
