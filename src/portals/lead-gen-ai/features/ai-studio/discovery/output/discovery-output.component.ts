import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TableComponent, PaginationComponent } from '@app-global';
import { AiStudioService, StudioEntity } from '../../ai-studio.service';
import { StudioRowActionsCell } from '../../entities/grid-cells/studio-entity-grid-cell.component';

/** Attributed discovery output — latest entities grid + dossier deep-link. */
@Component({
  selector: 'app-discovery-output',
  standalone: true,
  imports: [CommonModule, TableComponent, PaginationComponent],
  template: `
  <section class="card ds-grid">
    <h3>Attributed discovery output</h3>
    <org-grid [data]="entities" [options]="grid" [isLoading]="loading"></org-grid>
    <org-grid-pagination [page]="page" [count]="total" [perPage]="perPage" [loading]="loading" (cb)="pageChange.emit($event)"></org-grid-pagination>
    <p class="muted" *ngIf="!entities.length">Run discovery to generate attributed records.</p>
  </section>`
})
export class DiscoveryOutputComponent {
  studio = inject(AiStudioService); router = inject(Router); route = inject(ActivatedRoute);
  @Input() entities: StudioEntity[] = []; @Input() loading = false;
  @Input() page = 1; @Input() perPage = 25; @Input() total = 0;
  @Output() pageChange = new EventEmitter<{ skip: number; take: number }>();

  grid: any = {
    header: { title: 'Attributed discovery output', desc: null, add: false, refresh: false, edit: false, delete: false },
    total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
    columnDefs: [
      { field: 'name', headerName: 'Entity' },
      { field: 'classification', headerName: 'Classification' },
      { field: 'source', headerName: 'Primary source' },
      { field: 'stage', headerName: 'Stage' },
      { field: 'score', headerName: 'Confidence', cellFn: (e: StudioEntity) => e.score + '/100' },
      { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [{ label: 'Open Dossier', run: (e: StudioEntity) => this.inspect(e) }] },
    ],
  };

  inspect(e: StudioEntity) {
    this.studio.pendingEntityId = e.id;
    const ws = this.studio.workspace?.key ?? 'business-growth';
    this.router.navigate([ws, 'entities'], { relativeTo: this.route.parent });
  }
}
