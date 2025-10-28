import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SchedulerLogService} from "../services/scheduler-log.service";
import {DateFormatCell, FullDateFormatCell, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import { ScheduleLog, ScheduleLogQueryOptions } from "../domains/schedule-log.serializer";
import {PipelineAPIResolver} from "../resolver/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/scheduler-log.html',
  styles: [':host { display: contents; }']
})
export class SchedulerLogView extends ViewExtender<ScheduleLog> implements OnInit, OnDestroy {
  override coreState: ScheduleLogQueryOptions = new ScheduleLogQueryOptions();
  constructor(private router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: SchedulerLogService,
              public lookupResolver: PipelineAPIResolver){
      super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name'},
          {headerName: 'AutoRun', field: 'isAutoRun', cellTemplate: GridUISwitchCellComponent},

          {headerName: 'Frequency Type', field: 'frequencyTypeName'},
          {headerName: 'Priority', field: 'taskPriorityName'},

          {headerName: 'Start Date', field: 'startDate', cellTemplate: FullDateFormatCell},
          {headerName: 'Due On', field: 'dueDate', cellTemplate: FullDateFormatCell},
          {headerName: 'Success', field: 'isSuccess', cellTemplate: GridUISwitchCellComponent},
          {headerName: 'End Date', field: 'endDate', cellTemplate: FullDateFormatCell},

          {headerName: 'Status', field: 'taskStatusTypeName'},
          {headerName: 'Verified By', field: 'verifiedByEmployeeName'},
          {headerName: 'Created', field: 'createdDate', cellTemplate: FullDateFormatCell}
      ];
  }

    onActivate(componentRef){
      this.actionTemplate = componentRef.actionTemplate;
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit(){ super.populateGrid(); }

    actionCb(schedule: ScheduleLog){
        const { orgTaskScheduleId, name } = schedule;
        const inputData: any = {
            id: orgTaskScheduleId, //Schedular ID
            //orgTaskId: orgTaskId, //Org Task Id
            // isManual: isManual,
            // isFeeTask: isFeeTask
        };
        this.lookupResolver.showSchedulerPopup(inputData, { text: `${name}`, desc: `` }, ()=>{
          super.populateGrid();
        });
    }
}
