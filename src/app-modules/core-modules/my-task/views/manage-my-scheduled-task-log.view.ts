import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DateFormatCell, ViewExtender} from "@app-global";
import {MyTaskAPIResolver} from "../services/api.resolver";
import {MyTaskSchedulerLogService} from "../services/my-task-scheduler-log.service";
import {MyTaskScheduleLog, MyTaskScheduleLogQueryOptions} from "../domains/my-task/my-task-schedule-log.serializer";
import {MyTaskLogNameActionCell, MyTaskLogRunCell} from "../grid-cells/my-task-log-grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/scheduled-task.html'
})
export class ManageMyScheduledTaskLogView extends ViewExtender<MyTaskScheduleLog> implements OnInit, OnDestroy {
  override coreState: MyTaskScheduleLogQueryOptions = new MyTaskScheduleLogQueryOptions();
    constructor(public override service: MyTaskSchedulerLogService,
                public router: Router,
                public override activatedRoute: ActivatedRoute,
                public apiResolver: MyTaskAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name', cellTemplate: MyTaskLogNameActionCell},
            {headerName: 'AutoRun', field: 'isAutoRun'},
            {headerName: 'Frequency Type', field: 'frequencyTypeName'},

            {headerName: 'Start On', field: 'startDate', cellTemplate: DateFormatCell},
            {headerName: 'End On', field: 'endDate', cellTemplate: DateFormatCell},
            {headerName: 'Due On/ Status', field: 'taskStatusTypeName', cellTemplate: MyTaskLogRunCell}
        ];
    }

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){
        //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
        // (<MyTaskScheduleLogQueryOptions>this.coreState).orgUserId = this.coreService.currentUser.id;
      super.populateGrid();
    }

    actionCb(schedule: MyTaskScheduleLog){
        const { orgTaskScheduleId, name } = schedule;
        const inputData: any = {
            id: orgTaskScheduleId, //Schedular ID
            // taskId: orgTaskId, //Org Task Id
            isManual: false,
            // isFeeTask: isFeeTask
        };
        this.apiResolver.showSchedulerPopup(inputData, { text: `${name}`, desc: `` });
    }
}
