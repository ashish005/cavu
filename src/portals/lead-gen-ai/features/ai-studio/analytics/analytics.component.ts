import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService } from '../ai-studio.service';
import { StudioBadgeCellComponent } from '../entities/grid-cells/studio-entity-grid-cell.component';

/** Analytics — funnel, velocity, provider performance, channel stats. */
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, PaginationComponent],
  template: `
  <div>
    <div class="page-head"><div><h1>Analytics</h1><p class="sub">Pipeline velocity, provider performance & channel attribution</p></div></div>

    <div class="kpi-grid">
      <div class="kpi"><div class="k-label">Entities</div><div class="k-value">{{ kpis.total }}</div></div>
      <div class="kpi success"><div class="k-label">Qualified</div><div class="k-value">{{ kpis.qualified }}</div></div>
      <div class="kpi"><div class="k-label">Avg score</div><div class="k-value">{{ kpis.avgScore }}</div></div>
      <div class="kpi warn"><div class="k-label">Pending bookings</div><div class="k-value">{{ kpis.pendingBookings }}</div></div>
      <div class="kpi"><div class="k-label">Runs (7d)</div><div class="k-value">{{ kpis.runs7d }}</div></div>
    </div>

    <div class="cols">
      <section class="card">
        <h3>Stage distribution</h3>
        <div class="funnel" *ngFor="let f of funnel">
          <div class="f-label">{{ f.stage }}</div>
          <div class="f-bar"><div class="f-fill" [style.width.%]="f.pct"></div></div>
          <div class="f-count">{{ f.count }}</div>
        </div>
        <p class="muted" *ngIf="!funnel.length">No entities.</p>
      </section>
      <section class="card">
        <h3>Classification mix</h3>
        <div class="funnel" *ngFor="let c of classMix">
          <div class="f-label">{{ c.name }}</div>
          <div class="f-bar"><div class="f-fill alt" [style.width.%]="c.pct"></div></div>
          <div class="f-count">{{ c.count }}</div>
        </div>
      </section>
    </div>

    <div class="cols">
      <section class="card">
        <h3>Discovery velocity</h3>
        <svg viewBox="0 0 300 90" class="chart" *ngIf="series.length">
          <polyline [attr.points]="lineFor(0)" fill="none" stroke="#3467d6" stroke-width="2"/>
          <polyline [attr.points]="lineFor(1)" fill="none" stroke="#22b8a6" stroke-width="2"/>
        </svg>
        <p class="muted" *ngIf="!series.length">No runs yet.</p>
        <div class="legend"><span class="dot" style="background:#3467d6"></span>14d <span class="dot" style="background:#22b8a6"></span>30d</div>
      </section>
    </div>

    <div class="cols">
      <section class="card">
        <h3>Source attribution — yield &amp; cost per qualified</h3>
        <org-grid [data]="sourceRoi" [options]="roiGrid"></org-grid>
      </section>
      <section class="card">
        <h3>LLM provider performance (30d)</h3>
        <org-grid [data]="providerStats" [options]="providerStatsGrid"></org-grid>
      </section>
    </div>

    <div class="cols">
      <section class="card">
        <h3>Campaigns</h3>
        <org-grid [data]="campaigns" [options]="campGrid" [isLoading]="campLoading"></org-grid>
        <org-grid-pagination [page]="campPage" [count]="campTotal" [perPage]="campPageSize" [loading]="campLoading" (cb)="onCampPage($event)"></org-grid-pagination>
      </section>
      <section class="card">
        <h3>Appointments</h3>
        <org-grid [data]="appts" [options]="apptGrid" [isLoading]="apptLoading"></org-grid>
        <org-grid-pagination [page]="apptPage" [count]="apptTotal" [perPage]="apptPageSize" [loading]="apptLoading" (cb)="onApptPage($event)"></org-grid-pagination>
      </section>
    </div>
  </div>`,
  styles: [`
    .funnel{display:grid;grid-template-columns:110px 1fr 44px;gap:8px;align-items:center;padding:6px 0;font-size:13px}
    .f-label{color:var(--st-muted,#6b7690);font-size:12px}.f-bar{height:9px;background:#eef1f8;border-radius:5px;overflow:hidden}
    .f-fill{height:100%;background:linear-gradient(90deg,#3467d6,#6ea8ff);border-radius:5px;transition:width .3s}
    .f-fill.alt{background:linear-gradient(90deg,#22b8a6,#7fd4c9)}
    .f-count{font-weight:600;text-align:right}
    .chart{width:100%;height:90px}.legend{font-size:11px;color:var(--st-muted,#6b7690);margin-top:6px}
    .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 4px 0 10px}
    .row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--st-border,#e6e9f2);font-size:13px}
    table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:7px 8px;border-bottom:1px solid var(--st-border,#e6e9f2);text-align:left}
  `]
})
export class AnalyticsComponent implements OnInit {
  studio = inject(AiStudioService);
  kpis: any = {}; series: number[][] = []; providerStats: any[] = []; sourceRoi: any[] = [];
  campaigns: any[] = []; appts: any[] = [];
  roiGrid: any = {
    header: { title: 'Source attribution', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'source', headerName: 'Source' },
      { field: 'discovered', headerName: 'Discovered' },
      { field: 'qualified', headerName: 'Qualified' },
      { headerName: 'Yield', cellFn: (r: any) => r.yield + '%' },
      { field: 'avgScore', headerName: 'Avg score' },
      { headerName: 'Cost/qual', cellFn: (r: any) => '$' + r.costPerQualified },
    ],
  };
  providerStatsGrid: any = {
    header: { title: 'LLM provider performance', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'provider', headerName: 'Provider' },
      { field: 'calls', headerName: 'Calls' },
      { headerName: 'Success', cellFn: (a: any) => (a.successRate * 100).toFixed(0) + '%' },
      { headerName: 'Avg ms', cellFn: (a: any) => Math.round(a.avgLatencyMs) },
      { headerName: 'Cost', cellFn: (a: any) => '$' + a.totalCostUsd.toFixed(4) },
    ],
  };
  campPage = 1; campPageSize = 25; campTotal = 0; campLoading = false;
  apptPage = 1; apptPageSize = 25; apptTotal = 0; apptLoading = false;
  campGrid: any = {
    header: { title: 'Campaigns', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Name' },
      { field: 'channel', headerName: 'Channel' },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v === 'active' ? 'ok' : '' },
    ],
  };
  apptGrid: any = {
    header: { title: 'Appointments', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { headerName: 'When', cellFn: (a: any) => new Date(a.startUtc).toLocaleString() },
      { field: 'status', headerName: 'Status', cellTemplate: StudioBadgeCellComponent, tone: (v: any) => v === 'confirmed' ? 'ok' : v === 'pending' ? 'warn' : '' },
    ],
  };

  ngOnInit() {
    this.studio.kpis$.subscribe(k => { this.kpis = k; });
    this.studio.listKpis().subscribe({ error: () => {} });
    this.studio.listRuns().subscribe({ error: () => {} });
    this.studio.listEntitiesPaged(undefined, 1, 300).subscribe({ error: () => {} });
    this.studio.llmAnalytics().subscribe(a => this.providerStats = a?.providers ?? []);
    this.studio.listSourceRoi().subscribe(r => this.sourceRoi = r);
    this.studio.listCampaigns(this.campPage, this.campPageSize).subscribe(p => { this.campaigns = p.items; this.campTotal = p.totalCount; });
    this.studio.listAppointments(this.apptPage, this.apptPageSize).subscribe(p => { this.appts = p.items; this.apptTotal = p.totalCount; });
    // velocity series from runs
    setTimeout(() => this.buildSeries(), 800);
  }
  onCampPage(e: { skip: number; take: number }) { this.campPageSize = e.take; this.campPage = Math.floor(e.skip / e.take) + 1; this.studio.listCampaigns(this.campPage, this.campPageSize).subscribe(p => { this.campaigns = p.items; this.campTotal = p.totalCount; }); }
  onApptPage(e: { skip: number; take: number }) { this.apptPageSize = e.take; this.apptPage = Math.floor(e.skip / e.take) + 1; this.studio.listAppointments(this.apptPage, this.apptPageSize).subscribe(p => { this.appts = p.items; this.apptTotal = p.totalCount; }); }
  buildSeries() {
    const runs = this.studio.runs$.value;
    const mk = (days: number) => Array.from({ length: days }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
      const day = d.toISOString().slice(0, 10);
      return runs.filter(r => r.ranAt.slice(0, 10) === day).reduce((s, r) => s + r.results, 0);
    });
    const s14 = mk(14), s30 = mk(30);
    this.series = [s14, s30.slice(-14)];
  }
  lineFor(idx: number) {
    const s = this.series[idx] ?? [0]; const max = Math.max(...s, 1);
    return s.map((v, i) => `${(i / Math.max(s.length - 1, 1)) * 290 + 5},${85 - (v / max) * 75}`).join(' ');
  }
  get funnel() {
    const stages = this.studio.industry?.stages ?? [];
    const entities = this.studio.entities$.value;
    const max = Math.max(...stages.map(s => entities.filter(e => e.stage === s).length), 1);
    return stages.map(s => { const c = entities.filter(e => e.stage === s).length; return { stage: s, count: c, pct: (c / max) * 100 }; }).filter(f => f.count > 0);
  }
  get classMix() {
    const entities = this.studio.entities$.value;
    const groups: Record<string, number> = {};
    entities.forEach(e => groups[e.classification] = (groups[e.classification] ?? 0) + 1);
    const max = Math.max(...Object.values(groups), 1);
    return Object.entries(groups).map(([name, count]) => ({ name, count, pct: (count / max) * 100 }));
  }
}
