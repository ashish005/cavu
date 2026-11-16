import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DiscoverySource { key: string; label: string; category: string; scope: string; latency: string; volume: string }

/** Permitted sources catalogue — arm/disarm checklist. */
@Component({
  selector: 'app-discovery-sources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="card">
    <h3>Permitted discovery sources</h3>
    <label class="ds-src" *ngFor="let s of sources" [class.on]="selected.has(s.key)">
      <input type="checkbox" [checked]="selected.has(s.key)" (change)="toggle.emit(s.key)"/>
      <div><b>{{ s.label }}</b>
        <div class="muted">{{ s.category }} · {{ s.scope }}</div>
        <div class="muted">{{ s.latency }} avg · {{ s.volume }} indexed</div></div>
    </label>
  </section>`
})
export class DiscoverySourcesComponent {
  @Input() sources: DiscoverySource[] = []; @Input() selected = new Set<string>();
  @Output() toggle = new EventEmitter<string>();
}
