import {Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LogAPIResolver} from "../services/api.resolver";
import { ViewExtender, FullDateFormatCell } from "@app-global";
import {OrgTaskLogService} from "../services/log.service";
import {OrgTaskLog, OrgTaskLogQueryOptions} from "../domains/org-task-log.serializer";

@Component({
    standalone: false,
  templateUrl: './templates/org-task-log-view.html'
})
export class OrgTaskLogView extends ViewExtender<OrgTaskLog> implements OnInit, OnDestroy{
  override coreState: OrgTaskLogQueryOptions = new OrgTaskLogQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public apiResolver: LogAPIResolver,
              public override service: OrgTaskLogService) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs= [
          {headerName: 'Task', field: 'name'},
          {headerName: 'Frequency', field: 'frequencyTypeName'},
          {headerName: 'Start Date', field: 'startDate', cellTemplate: FullDateFormatCell},
          {headerName: 'Due Date', field: 'dueDate', cellTemplate: FullDateFormatCell},
          {headerName: 'End Date', field: 'endDate', cellTemplate: FullDateFormatCell},
          {headerName: 'Task Status', field: 'taskStatusTypeName'},
          {headerName: 'Success', field: 'isSuccess'},
          {headerName: 'Verified By', field: 'verifiedByEmployeeName'},
      ];
  }

  ngOnInit(){ super.populateGrid(); }
  override ngOnDestroy(){ super.ngOnDestroy(); }
    actionCb(e){}
}
