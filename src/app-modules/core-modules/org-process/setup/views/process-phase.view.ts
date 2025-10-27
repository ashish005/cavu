import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GridUISwitchCellComponent, NameCellComponent, ViewExtender} from "@app-global";
import {ProcessPhase, ProcessPhaseQueryOptions} from "../domains/process-phase.serializer";
import {ProcessPhaseService} from "../services/master-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/common-grid.html',
  providers: [ProcessPhaseService],
  styles: [`:host { display: contents; }`]
})
export class ProcessPhaseView extends ViewExtender<ProcessPhase> implements OnInit {
  type: string;
  override coreState: ProcessPhaseQueryOptions = new ProcessPhaseQueryOptions();
  constructor(public override service: ProcessPhaseService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.header = { title: 'Process Status', hide: true, footerHide: true, desc: 'Process Status details', add: false, refresh: true, edit: false, delete: false };
    this.gridOptions.columnDefs = [
        {headerName: 'Name', field: 'name', cellTemplate: NameCellComponent},
        {headerName: 'Default', field: 'isDefault', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit() { super.populateGrid(); }
}
