import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MyTaskAPIResolver} from "../../services/api.resolver";
import {MyTaskService} from "../../services/my-task.service";

@Component({
  standalone: false,
  templateUrl: './templates/manage-my-task-board.html'
})
export class ManageMyTaskBoardView implements OnInit {
  page: any;
  /*options: Array<any> = [
      { name: 'Today', sortOrder: 1, key: '' },
      { name: 'Past Due Date', sortOrder: 2, key: '' },
      { name: 'Upcoming Due Date', sortOrder: 3, key: '' },
      { name: 'No Date Aassigned', sortOrder: 4, key: '' }
  ];*/
  constructor(public service: MyTaskService,
              public apiResolver: MyTaskAPIResolver,
              public router: Router, public activatedRoute: ActivatedRoute) {
    //super(new OrgMyTaskQueryOptions(), activatedRoute, service);

    /*this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name' },
      {headerName: 'Status', field: 'status'},
      //{headerName: 'Task Type', field: 'taskType'},
      //{headerName: 'Next Run Time', field: 'nextRunTime', cellFn: rowData => this.sharedService.customDateTime(rowData.nextRunTime)},
      //{headerName: 'Last Run Time', field: 'lastRunTime', cellFn: rowData => this.sharedService.customDateTime(rowData.lastRunTime)},
      {headerName: 'Last Run Result', field: 'lastRunResult'}
    ];*/
    const { data, parent} = this.activatedRoute.snapshot;
    this.page = <any>data || <any>parent?.data;
  }

  ngOnInit(){
      /*(<OrgMyTaskQueryOptions>this.coreState).view = this.activatedRoute.snapshot.data.key;
      super.populateGrid();*/
  }
  addRecord(){}
}
