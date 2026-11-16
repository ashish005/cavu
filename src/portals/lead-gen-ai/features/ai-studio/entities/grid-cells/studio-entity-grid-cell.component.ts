import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponent } from '@app-global';

/** Name + score cell for the entities grid. */
@Component({
  selector: 'app-studio-entity-name-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<div><b>{{ context.name }}</b><div class="muted">{{ context.classification }} · {{ context.source }}</div></div>`,
  styles: [`.muted{color:#888;font-size:11px}`]
})
export class StudioEntityNameCellComponent extends DynamicComponent {}

/** Score bar cell. */
@Component({
  selector: 'app-studio-entity-score-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="bar"><div class="fill" [style.width.%]="context.score"></div></div><span>{{ context.score }}</span>`,
  styles: [`.bar{height:5px;background:#e5e9f2;border-radius:3px;margin-bottom:3px}.fill{height:100%;background:#3467d6;border-radius:3px}`]
})
export class StudioEntityScoreCellComponent extends DynamicComponent {}

/**
 * Generic per-row action buttons for `org-grid`.
 * Configure the column with `actions: [{ label, class?, when?(row), run(row) }]` (closures defined in the grid options).
 * `label` may be a string or a function `(row) => string`; `when(row)` hides the button when it returns false.
 */
@Component({
  selector: 'app-studio-row-actions-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="nowrap"><ng-container *ngFor="let a of actions"><button *ngIf="!a.when || a.when(context)" type="button" class="mini" [ngClass]="a.class" (click)="run(a, context)">{{ label(a) }}</button></ng-container></div>`,
  styles: [`.nowrap{white-space:nowrap}.mini{font-size:11px;padding:3px 8px;border-radius:8px;border:1px solid #ddd;background:transparent;color:inherit;cursor:pointer;margin-right:4px}.mini.primary{background:#3467d6;color:#fff;border-color:#3467d6}.mini.danger{color:#c0392b;border-color:#f3c1c1}`]
})
export class StudioRowActionsCell extends DynamicComponent {
  get actions(): any[] { return this.col?.actions ?? []; }
  label(a: any) { return typeof a?.label === 'function' ? a.label(this.context) : a?.label; }
  run(a: any, row: any) { a?.run?.(row); }
}

/** Coloured status badge cell. Configure the column with `tone(row[field])` returning 'ok' | 'warn' | 'danger' | ''. */
@Component({
  selector: 'app-studio-badge-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="tone()">{{ context[col?.field] }}</span>`,
  styles: [`.badge{font-size:11px;background:#eee;border-radius:10px;padding:2px 8px;text-transform:lowercase}.badge.ok{background:#d9f2e4;color:#1a7f4b}.badge.warn{background:#fef3c7;color:#92400e}.badge.danger{background:#fde2e2;color:#c0392b}`]
})
export class StudioBadgeCellComponent extends DynamicComponent {
  tone() { return this.col?.tone ? this.col.tone(this.context?.[this.col.field]) : ''; }
}

/** Row-selection checkbox for `org-grid`. Mutates `row.isChecked` so the host can compute a selection. */
@Component({
  selector: 'app-studio-select-cell',
  standalone: true,
  imports: [CommonModule],
  template: `<input type="checkbox" class="row-check" [checked]="!!context.isChecked" (change)="toggle()"/>`,
  styles: [`.row-check{cursor:pointer}`]
})
export class StudioSelectCellComponent extends DynamicComponent {
  toggle() { this.context.isChecked = !this.context.isChecked; }
}
