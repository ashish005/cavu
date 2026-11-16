import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiStudioService } from '../../ai-studio.service';

/** Query builder card — presets, intent, geo, classification, gate, actions. */
@Component({
  selector: 'app-discovery-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="card">
    <h3>Search criteria &amp; saved queries</h3>
    <div class="ds-presets" *ngIf="presets.length">
      <small class="muted">Saved for {{ studio.workspace?.label }}:</small>
      <button class="chip" *ngFor="let p of presets" (click)="applyPreset.emit(p)">{{ p.name }}</button>
    </div>
    <div class="ds-field"><label>Discovery intent &amp; signal query</label>
      <textarea [(ngModel)]="query" rows="3" placeholder="e.g. B2B companies modernizing legacy portals, hiring platform engineers…"></textarea></div>
    <div class="ds-row3">
      <div class="ds-field"><label>Geographic targeting</label><input [(ngModel)]="geography" placeholder="Global"/></div>
      <div class="ds-field"><label>Entity classification</label>
        <select [(ngModel)]="entityType"><option *ngFor="let c of classes" [value]="c">{{ c }}</option></select></div>
      <div class="ds-field"><label>Min confidence gate</label>
        <select [(ngModel)]="minScore"><option *ngFor="let g of gates" [ngValue]="g">{{ g }} / 100</option></select></div>
    </div>
    <div class="ds-actions">
      <button class="btn" (click)="saveSearch.emit()">Save search</button>
      <button class="btn primary" [disabled]="!query.trim() || !armedCount || scanning" (click)="run.emit()">
        {{ scanning ? 'Scanning sources…' : '▶ Run discovery' }}</button>
      <button class="btn" *ngIf="hasLastRun" (click)="rerun.emit()">↻ Re-run</button>
    </div>
  </section>`
})
export class DiscoveryBuilderComponent {
  studio = inject(AiStudioService);
  @Input() presets: any[] = []; @Input() classes: string[] = []; @Input() gates: number[] = [];
  @Input() armedCount = 0; @Input() scanning = false; @Input() hasLastRun = false;
  @Output() applyPreset = new EventEmitter<any>(); @Output() saveSearch = new EventEmitter<void>();
  @Output() run = new EventEmitter<void>(); @Output() rerun = new EventEmitter<void>();
  query = ''; geography = 'Global'; entityType = 'Prospect'; minScore = 75;
  /** Parent pushes preset values in via apply(); call after preset click too. */
  applyPresetValues(p: any) { const q = p.query ?? {}; this.query = q.query ?? this.query; this.geography = q.geo ?? this.geography; this.entityType = q.classification ?? this.entityType; this.minScore = q.minScore ?? this.minScore; }
}
