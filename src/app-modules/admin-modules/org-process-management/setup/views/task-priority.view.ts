import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GridUISwitchCellComponent, NameCellComponent, ViewExtender} from "@app-global";
import {TaskPriority, TaskPriorityQueryOptions} from "../domains/task-priority.serializer";
import {TaskPriorityService} from "../services/master-type.service";

@Component({
  standalone: false,
  templateUrl: './templates/common-grid.html',
  providers: [TaskPriorityService],
  styles: [`:host { display: contents; }`]
})
export class TaskPriorityView extends ViewExtender<TaskPriority> implements OnInit {
  type: string;
  override coreState: TaskPriorityQueryOptions = new TaskPriorityQueryOptions();
  constructor(public override service: TaskPriorityService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.header = { title: 'Task Priority', hide: true, footerHide: true, desc: 'Task Priority', add: false, refresh: true, edit: false, delete: false };
    this.gridOptions.columnDefs = [
        {headerName: 'Name', field: 'name', cellTemplate: NameCellComponent},
        {headerName: 'Color', field: 'color'},
        {headerName: 'Order', field: 'sortOrder'},
        {headerName: 'Default', field: 'isDefault', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
    ];
  }

  ngOnInit() { super.populateGrid(); }
  actionCb(e){}
}
