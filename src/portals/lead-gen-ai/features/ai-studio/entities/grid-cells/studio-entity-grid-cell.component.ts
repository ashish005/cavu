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
