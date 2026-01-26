import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GridUISwitchCellComponent, NameCellComponent, ViewExtender} from "@app-global";
import {WorkflowPhaseStatus, WorkflowPhaseStatusQueryOptions} from "../domains/workflow-phase-status.serializer";
import {WorkflowPhaseStatusService} from "../services/master-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/common-grid.html',
  providers: [WorkflowPhaseStatusService],
  styles: [`:host { display: contents; }`]
})
export class WorkflowPhaseStatusView extends ViewExtender<WorkflowPhaseStatus> implements OnInit {
  type: string;
  override coreState: WorkflowPhaseStatusQueryOptions = new WorkflowPhaseStatusQueryOptions();
  constructor(public override service: WorkflowPhaseStatusService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.header = { title: 'Workflow Phase Status', hide: true, footerHide: true, desc: 'Workflow Phase Status details', add: false, refresh: true, edit: false, delete: false };
    this.gridOptions.columnDefs = [
        {headerName: 'Name', field: 'name', cellTemplate: NameCellComponent},
        {headerName: 'Default', field: 'isDefault', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
    ];
  }

  ngOnInit() { super.populateGrid(); }
    actionCb(e){}
}
