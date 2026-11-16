import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { skip } from 'rxjs/operators';
import { AiStudioService, Run, StudioEntity } from '../ai-studio.service';
import { DiscoveryBuilderComponent } from './builder/discovery-builder.component';
import { DiscoverySourcesComponent } from './sources/discovery-sources.component';
import { DiscoveryRunsComponent } from './runs/discovery-runs.component';
import { DiscoveryOutputComponent } from './output/discovery-output.component';
import { DISCOVERY_SOURCES as SOURCES, CLASSES, GATES, srcs, shortId } from './discovery.shared';

/** Discovery Studio — composed of small cards: builder, sources, runs log, attributed output. */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DiscoveryBuilderComponent, DiscoverySourcesComponent, DiscoveryRunsComponent, DiscoveryOutputComponent],
  template: `
  <div>
    <div class="page-head">
      <div><h1>Multi-Source Discovery Studio</h1><p class="sub">Permission-scoped intake across registries, job boards, directories &amp; web signals</p></div>
      <span class="ds-armed">{{ selected.size }} of {{ sources.length }} sources armed</span>
    </div>

    <div class="ds-cols">
      <app-discovery-builder
        [presets]="presets" [classes]="classes" [gates]="gates"
        [armedCount]="selected.size" [scanning]="scanning" [hasLastRun]="!!lastRun"
        (applyPreset)="onPreset($event)" (saveSearch)="savePreset()" (run)="run()" (rerun)="rerun()">
      </app-discovery-builder>
      <app-discovery-sources [sources]="sources" [selected]="selected" (toggle)="toggle($event)"></app-discovery-sources>
    </div>

    <app-discovery-runs [runs]="runs" [loading]="runsLoading" [page]="runsPage" [perPage]="runsPageSize" [total]="runsTotal"
      (pageChange)="onRunsPage($event)" (rerun)="rerunRun($event)"></app-discovery-runs>
    <app-discovery-output [entities]="outputEntities" [loading]="outputLoading" [page]="outputPage" [perPage]="outputPageSize" [total]="outputTotal"
      (pageChange)="onOutputPage($event)"></app-discovery-output>
  </div>`
})
export class DiscoveryStudioComponent implements OnInit {
  studio = inject(AiStudioService);
  @ViewChild(DiscoveryBuilderComponent) builder?: DiscoveryBuilderComponent;
  sources = SOURCES; classes = CLASSES; gates = GATES;
  selected = new Set<string>(['registry', 'web', 'job-boards']);
  lastRun?: Run; scanning = false; presets: any[] = [];
  runs: Run[] = []; outputEntities: StudioEntity[] = [];
  runsPage = 1; runsPageSize = 25; runsTotal = 0; runsLoading = false;
  outputPage = 1; outputPageSize = 25; outputTotal = 0; outputLoading = false;

  ngOnInit() {
    this.loadRuns(); this.loadOutput();
    this.studio.workspace$.subscribe(w => {
      if (!w?.key) return;
      this.studio.listPresets(w.key).subscribe(p => this.presets = p);
    });
    this.studio.reloaded$.pipe(skip(1)).subscribe(() => { this.loadRuns(); this.loadOutput(); });
  }

  loadRuns() {
    this.runsLoading = true;
    this.studio.listRuns(this.runsPage, this.runsPageSize).subscribe({
      next: p => { this.runs = p.items; this.runsTotal = p.totalCount; this.runsLoading = false; },
      error: () => this.runsLoading = false,
    });
  }
  loadOutput() {
    this.outputLoading = true;
    this.studio.listEntitiesPaged(undefined, this.outputPage, this.outputPageSize).subscribe({
      next: p => { this.outputEntities = p.items; this.outputTotal = p.totalCount; this.outputLoading = false; },
      error: () => this.outputLoading = false,
    });
  }
  onRunsPage(e: { skip: number; take: number }) { this.runsPageSize = e.take; this.runsPage = Math.floor(e.skip / e.take) + 1; this.loadRuns(); }
  onOutputPage(e: { skip: number; take: number }) { this.outputPageSize = e.take; this.outputPage = Math.floor(e.skip / e.take) + 1; this.loadOutput(); }
  toggle(k: string) { this.selected.has(k) ? this.selected.delete(k) : this.selected.add(k); }

  onPreset(p: any) { this.builder?.applyPresetValues(p); }
  savePreset() {
    const b = this.builder; if (!b) return;
    const name = prompt('Preset name:'); if (!name) return;
    this.studio.savePreset(name, { query: b.query, geo: b.geography, classification: b.entityType, minScore: b.minScore }, this.studio.workspace?.key)
      .subscribe(() => this.studio.listPresets(this.studio.workspace?.key).subscribe(p => this.presets = p));
  }
  private cfg() { const b = this.builder!; return { q: b.query.trim(), g: b.geography, c: b.entityType, m: b.minScore }; }
  run() {
    const c = this.cfg(); if (!c.q || !this.selected.size) return;
    this.scanning = true;
    this.studio.runDiscovery(c.q, [...this.selected], c.g, c.c, c.m)
      .subscribe(r => { this.lastRun = r; this.scanning = false; this.loadRuns(); this.loadOutput(); });
  }
  rerun() { if (this.lastRun) this.rerunRun(this.lastRun); }
  rerunRun(r: Run) {
    let srcs: string[] = []; try { srcs = JSON.parse(r.sourcesJson); } catch { }
    const c = this.cfg(); this.scanning = true;
    this.studio.runDiscovery(r.query, srcs, r.geography || c.g || 'Global', c.c, c.m)
      .subscribe(() => { this.scanning = false; this.loadRuns(); this.loadOutput(); });
  }
}
