import {Component, OnInit, inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { skip } from 'rxjs/operators';
import {AiStudioService, StudioEntity} from '../../ai-studio.service';
import {DiscoveryBuilderComponent} from "../builder/discovery-builder.component";
import {CLASSES, DISCOVERY_SOURCES as SOURCES, GATES} from "../discovery.shared";
import {DiscoverySourcesComponent} from "./discovery-sources.component";
import {ActivatedRoute} from "@angular/router";

/** Discovery → Attributed Output (independent child route). */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DiscoveryBuilderComponent, DiscoverySourcesComponent],
  template: `
  <div>
    <div class="page-head">
      <span class="ds-armed">{{ selected.size }} of {{ sources.length }} sources armed</span>
    </div>
    <app-discovery-builder
        [presets]="presets" [classes]="classes" [gates]="gates"
        [armedCount]="selected.size" [scanning]="scanning" [hasLastRun]="!!lastRun"
        (applyPreset)="onPreset($event)" (saveSearch)="savePreset()" (run)="run()" (rerun)="run()">
    </app-discovery-builder>
    <app-discovery-sources [sources]="sources" [selected]="selected" (toggle)="toggle($event)"></app-discovery-sources>
  </div>`
})
export class DiscoverySourceViewComponent implements OnInit {
  studio = inject(AiStudioService); route = inject(ActivatedRoute);
  @ViewChild(DiscoveryBuilderComponent) builder?: DiscoveryBuilderComponent;
  sources = SOURCES; classes = CLASSES; gates = GATES;
  selected = new Set<string>(['registry', 'web', 'job-boards']);
  lastRun?: any;
  scanning = false;
  presets: any[] = [];
  runs: any[] = []; outputEntities: StudioEntity[] = [];
  runsPage = 1; runsPageSize = 25; runsTotal = 0; runsLoading = false;
  outputPage = 1; outputPageSize = 25; outputTotal = 0; outputLoading = false;

  ngOnInit() {
    this.studio.workspace$.subscribe(w => {
      if (!w?.key) return;
      this.studio.listPresets(w.key).subscribe(p => this.presets = p);
    });
    this.studio.reloaded$.pipe(skip(1)).subscribe(() => {});
  }

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
    //this.scanning = true;
    // this.studio.runDiscovery(c.q, [...this.selected], c.g, c.c, c.m)
    //     .subscribe(r => { this.lastRun = r; this.scanning = false; });
  }
}
