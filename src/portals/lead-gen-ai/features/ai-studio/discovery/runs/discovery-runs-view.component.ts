import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shortId, SOURCES, srcs } from '../discovery.shared';
import {NumberCell, PaginationComponent, TableComponent, ViewExtender} from '@app-global';
import { StudioRowActionsCell } from '../../entities/grid-cells/studio-entity-grid-cell.component';
import {Run, RunQueryOptions} from "./run.serializer";
import {RunService} from "./run.service";
import {ActivatedRoute} from "@angular/router";

/** Discovery → Runs & Attribution Log (child route). */
@Component({
  selector: 'app-discovery-runs-view',
  standalone: true,
  imports: [CommonModule, TableComponent, PaginationComponent],
  providers: [RunService],
  templateUrl: 'runs.html'
})
export class DiscoveryRunsViewComponent extends ViewExtender<Run> implements OnInit {
  override coreState: RunQueryOptions = new RunQueryOptions();
  constructor(public override service: RunService, public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions = {
      header: { title: 'Discovery runs & attribution log', desc: null, add: false, refresh: false, edit: false, delete: false },
      total: 0, hasNext: false, hasPrevious: false, isOrderable: false,
      columnDefs: [
        { field: 'id', headerName: 'Run', cellFn: (r: Run) => shortId(r.id) + ' · ' + new Date(r.ranAt).toLocaleString() },
        { field: 'query', headerName: 'Query & geography', cellFn: (r: Run) => r.geography ? `${r.query} · ${r.geography}` : r.query },
        { field: 'sourcesJson', headerName: 'Sources', cellFn: (r: Run) => srcs(r, SOURCES) },
        { field: 'results', headerName: 'Discovered' },
        { field: 'qualifiedCount', headerName: 'Qualified' },
        { field: 'id', headerName: '', cellTemplate: StudioRowActionsCell, actions: [{ label: 'Re-run', run: (r: Run) => this.rerun(r) }] },
      ],
    }
  }

  ngOnInit() {
    super.populateGrid();
  }

  loadRuns(){ super.populateGrid(); }

  scanning: boolean;
  rerun(r: Run) {
    let sources: string[] = []; try { sources = JSON.parse(r.sourcesJson); } catch { }
    this.scanning = true;
    var data = { query: r.query, sources, geography: r.geography || 'Global' }; // , classification, minScore
    this.service.runDiscovery(data).subscribe({
      next: () => { this.scanning = false; super.populateGrid(); },
      error: () => this.scanning = false });
  }
  actionCb(e){}
}
