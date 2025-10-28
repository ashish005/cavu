import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GridUISwitchCellComponent, NameCellComponent, ViewExtender} from "@app-global";
import {TaskStatusType, TaskStatusTypeQueryOptions} from "../domains/task-status-type.serializer";
import {TaskStatusTypeService} from "../services/master-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/common-grid.html',
  providers: [TaskStatusTypeService],
  styles: [`:host { display: contents; }`]
})
export class TaskStatusTypeView extends ViewExtender<TaskStatusType> implements OnInit {
  type: string;
  override coreState: TaskStatusTypeQueryOptions = new TaskStatusTypeQueryOptions();
  constructor(public override service: TaskStatusTypeService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.header = { title: 'Task Status', hide: true, footerHide: true, desc: 'Process Status details', add: false, refresh: true, edit: false, delete: false };
    this.gridOptions.columnDefs = [
        {headerName: 'Name', field: 'name', cellTemplate: NameCellComponent},
        {headerName: 'Default', field: 'isDefault', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit() { super.populateGrid(); }
    actionCb(e){}
}
