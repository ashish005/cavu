import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiStudioService, Kpis, Run } from '../ai-studio.service';

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="cc">
    <div class="cc-head">
      <div>
        <h2>{{ studio.workspace?.label ?? 'Loading…' }}</h2>
        <p class="muted">{{ studio.industry?.label ?? '' }} · {{ today }}</p>
      </div>
      <div class="cc-actions">
        <select [(ngModel)]="industryKey" (change)="studio.setIndustry(industryKey)">
          <option *ngFor="let i of industries" [value]="i.key">{{ i.label }}</option>
        </select>
        <button class="btn" (click)="reset()">Reset</button>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi" *ngFor="let k of kpiCards"><span class="kpi-num">{{ k.value }}</span><span class="kpi-label">{{ k.label }}</span></div>
    </div>

    <div class="grid2">
      <section class="card">
        <h3>Discovery velocity <span class="muted">7d / 14d / 30d</span></h3>
        <svg viewBox="0 0 300 90" class="chart" *ngIf="series.length">
          <polyline [attr.points]="lineFor(0)" fill="none" stroke="#4f8cff" stroke-width="2"/>
          <polyline [attr.points]="lineFor(1)" fill="none" stroke="#22b8a6" stroke-width="2"/>
        </svg>
        <p class="muted" *ngIf="!series.length">No discovery runs yet — run one in Discovery Studio.</p>
      </section>
      <section class="card">
        <h3>Handoff &amp; priority queue</h3>
        <div class="row" *ngFor="let b of pendingBookings" (click)="go('pipeline')">
          <span>📅 {{ b.slot }}</span><span class="badge warn">{{ b.status }}</span>
        </div>
        <div class="row" *ngFor="let e of topEntities" (click)="go('entities')">
          <span>{{ e.name }}</span><span class="badge">{{ e.classification }} · {{ e.score }}</span>
        </div>
        <p class="muted" *ngIf="!pendingBookings.length && !topEntities.length">All clear.</p>
      </section>
    </div>

    <section class="card">
      <h3>Quick jump</h3>
      <input class="search" placeholder="Jump to entity, run, booking…" [(ngModel)]="query" (ngModelChange)="filter()"/>
      <div class="results">
        <div class="row" *ngFor="let r of results" (click)="go(r.route)"><span>{{ r.label }}</span><span class="muted">{{ r.hint }}</span></div>
      </div>
    </section>
  </div>`,
  styles: [`
    .cc{padding:16px;max-width:1100px;margin:0 auto}
    .cc-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
    h2{margin:0}h3{margin:0 0 10px}.muted{color:var(--muted,#888);font-size:12px}
    .cc-actions{display:flex;gap:8px;align-items:center}
    select,input{padding:6px 10px;border-radius:6px;border:1px solid var(--border,#ddd);background:var(--card,#fff);color:inherit}
    .btn{padding:6px 12px;border-radius:6px;border:1px solid var(--border,#ddd);background:transparent;color:inherit;cursor:pointer}
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:16px}
    .kpi{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px}
    .kpi-num{display:block;font-size:24px;font-weight:700}.kpi-label{font-size:12px;color:var(--muted,#888)}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
    .card{background:var(--card,#fff);border:1px solid var(--border,#eee);border-radius:10px;padding:14px}
    .chart{width:100%;height:90px}
    .row{display:flex;justify-content:space-between;padding:6px 4px;border-bottom:1px solid var(--border,#f0f0f0);cursor:pointer;font-size:13px}
    .badge{font-size:11px;background:#eef3ff;color:#3467d6;border-radius:10px;padding:2px 8px}
    .badge.warn{background:#fff4e0;color:#b26a00}
    .search{width:100%;box-sizing:border-box;margin-bottom:8px}
    .results .row{cursor:default}
  `]
})
export class CommandCenterComponent implements OnInit {
  studio = inject(AiStudioService); private router = inject(Router);
  get industries() { return this.studio.industryList; } industryKey = "";
  kpis: Kpis = { total: 0, qualified: 0, avgScore: 0, pendingBookings: 0, runs7d: 0 };
  series: number[][] = []; pendingBookings: any[] = []; topEntities: any[] = [];
  query = ''; results: { label: string; hint: string; route: string }[] = [];
  today = new Date().toLocaleDateString();

  ngOnInit() {
    this.studio.kpis$.subscribe(k => { this.kpis = k; this.buildSeries(); });
    this.studio.entities$.subscribe(e => this.topEntities = [...e].sort((a, b) => b.score - a.score).slice(0, 5));
    this.studio.bookings$.subscribe(b => this.pendingBookings = b.filter(x => x.status === 'pending').slice(0, 5));
    this.studio.loadConfig().subscribe(() => { this.industryKey = this.studio.industry?.key ?? ""; }); this.studio.refreshAll();
  }
  get kpiCards() {
    return [
      { label: 'Entities', value: this.kpis.total }, { label: 'Qualified', value: this.kpis.qualified },
      { label: 'Avg score', value: this.kpis.avgScore }, { label: 'Pending bookings', value: this.kpis.pendingBookings },
      { label: 'Runs (7d)', value: this.kpis.runs7d },
    ];
  }
  // T-104: dual-series 7d/14d/30d from run history (results per day buckets)
  buildSeries() {
    const runs = this.studio.runs$.value;
    const mk = (days: number) => Array.from({ length: days }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
      const day = d.toISOString().slice(0, 10);
      return runs.filter(r => r.ranAt.slice(0, 10) === day).reduce((s, r) => s + r.results, 0);
    });
    const s7 = mk(7), s14 = mk(14), s30 = mk(30);
    this.series = [s7, s14.map((_, i) => s14[i]), s30];
    // render last-14 window for both series
    this.series = [s14, s30.slice(-14)];
  }
  lineFor(idx: number) {
    const s = this.series[idx] ?? [0]; const max = Math.max(...s, 1);
    return s.map((v, i) => `${(i / Math.max(s.length - 1, 1)) * 290 + 5},${85 - (v / max) * 75}`).join(' ');
  }
  filter() {
    const q = this.query.toLowerCase();
    const items = [
      ...this.studio.entities$.value.map(e => ({ label: e.name, hint: `${e.classification} · score ${e.score}`, route: 'entities' })),
      ...this.studio.runs$.value.map(r => ({ label: r.query, hint: `run · ${r.results} results`, route: 'discovery' })),
      ...this.studio.workspaceList.map(w => ({ label: w.label, hint: 'workspace', route: 'command-center' })),
    ];
    this.results = items.filter(i => i.label.toLowerCase().includes(q)).slice(0, 8);
  }
  go(route: string) {
    const k = this.studio.workspace?.key;
    debugger
    if (k) this.router.navigate([k, route]);
  }
  reset() { this.studio.reset(); }
}
