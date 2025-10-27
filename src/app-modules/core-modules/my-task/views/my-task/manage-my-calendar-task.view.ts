import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MyTaskAPIResolver} from "../../services/api.resolver";
import {MyCalendar, MyCalendarQueryOptions} from "../../domains/my-task/my-calendar.serializer";
import {MyCalendarService} from "../../services/my-calendar.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/manage-my-calendar-task.html'
})
export class ManageMyCalendarTaskView extends ViewExtender<MyCalendar> implements OnInit {
  page: any;
  menuItem = [
      { name: 'Timeline', sortOrder: 1, route: 'timeline'},
      { name: 'Year', sortOrder: 2, route: 'year'},
      { name: 'Month', sortOrder: 3, route: 'month'},
      { name: 'Week', sortOrder: 4, route: 'week'},
      { name: 'Day', sortOrder: 5, route: 'day'}
  ];
  override coreState: MyCalendarQueryOptions = new MyCalendarQueryOptions();
  constructor(public override service: MyCalendarService,
              public lookupResolver: MyTaskAPIResolver,
              public router: Router,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name' },
        {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent},
      //{headerName: 'Task Type', field: 'taskType'},
      //{headerName: 'Next Run Time', field: 'nextRunTime', cellFn: rowData => this.sharedService.customDateTime(rowData.nextRunTime)},
      //{headerName: 'Last Run Time', field: 'lastRunTime', cellFn: rowData => this.sharedService.customDateTime(rowData.lastRunTime)},
      {headerName: 'Last Run Result', field: 'lastRunResult'}
    ];
      const { data, parent} = this.activatedRoute.snapshot;
      this.page = <any>data || <any>parent?.data;
  }

  ngOnInit(){}

  showData(item){this.router.navigate([item.route], {relativeTo: this.activatedRoute});}

  addRecord(){}
}
