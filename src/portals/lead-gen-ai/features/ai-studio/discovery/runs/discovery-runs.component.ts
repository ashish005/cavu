import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService, Run } from '../../ai-studio.service';
import { SOURCES, srcs, shortId } from '../discovery.shared';
import { StudioRowActionsCell } from '../../entities/grid-cells/studio-entity-grid-cell.component';

/** Discovery runs & attribution log — paged org-grid. */
@Component({
  selector: 'app-discovery-runs',
  standalone: true,
  imports: [CommonModule, TableComponent, PaginationComponent],
  template: `
  <section class="card ds-grid">
    <h3>Discovery runs &amp; attribution log</h3>
    <org-grid [data]="runs" [options]="grid" [isLoading]="loading"></org-grid>
    <org-grid-pagination [page]="page" [count]="total" [perPage]="perPage" [loading]="loading" (cb)="pageChange.emit($event)"></org-grid-pagination>
    <p class="muted" *ngIf="!runs.length">No runs yet.</p>
  </section>`
})
export class DiscoveryRunsComponent {
  studio = inject(AiStudioService);
  @Input() runs: Run[] = []; @Input() loading = false;
  @Input() page = 1; @Input() perPage = 25; @Input() total = 0;
  @Output() pageChange = new EventEmitter<{ skip: number; take: number }>();
  @Output() rerun = new EventEmitter<Run>();

  grid: any = {
    header: { title: 'Discovery runs & attribution log', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'id', headerName: 'Run', cellFn: (r: Run) => shortId(r.id) + ' · ' + new Date(r.ranAt).toLocaleString() },
      { field: 'query', headerName: 'Query & geography', cellFn: (r: Run) => r.geography ? `${r.query} · ${r.geography}` : r.query },
      { field: 'sourcesJson', headerName: 'Sources', cellFn: (r: Run) => srcs(r, SOURCES) },
      { field: 'results', headerName: 'Discovered' },
      { field: 'qualifiedCount', headerName: 'Qualified' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [{ label: 'Re-run', run: (r: Run) => this.rerun.emit(r) }] },
    ],
  };
}
