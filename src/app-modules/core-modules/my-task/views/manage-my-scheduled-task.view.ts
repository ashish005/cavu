import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { ViewExtender, FullDateFormatCell } from "@app-global";
import {MyTaskAPIResolver} from "../services/api.resolver";
import {
    ScheduledEndDateCell,
    ScheduledStartDateCell,
    ScheduledTaskLastRunCell,
    ScheduledTaskNameActionCell
} from "../grid-cells/scheduled-task-grid-cell.component";
import {
    MyTaskSchedule,
    MyTaskScheduleQueryOptions
} from "../domains/my-task/my-task-schedule.serializer";
import {MyTaskScheduleService} from "../services/my-task-scheduler.service";

@Component({
  standalone: false,
  templateUrl: './templates/scheduled-task.html'
})
export class ManageMyScheduledTaskView extends ViewExtender<MyTaskSchedule> implements OnInit, OnDestroy {
  override coreState: MyTaskScheduleQueryOptions = new MyTaskScheduleQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: MyTaskScheduleService,
                public apiResolver: MyTaskAPIResolver) {
        super(activatedRoute, service);
       this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name', cellTemplate: ScheduledTaskNameActionCell},
            {headerName: 'Frequency Type', field: 'frequencyType'},
            {headerName: 'Start On', field: 'modifiedDate', cellTemplate: ScheduledStartDateCell},
            {headerName: 'End On', field: 'modifiedDate', cellTemplate: ScheduledEndDateCell},
            {headerName: 'Last Start', field: 'lastRunStartTime', cellTemplate: FullDateFormatCell},
            {headerName: 'Last End', field: 'lastRunEndTime', cellTemplate: FullDateFormatCell},
            {headerName: 'Last Run', field: 'lastRun', cellTemplate: ScheduledTaskLastRunCell}
        ];
    }

    //onActivate(componentRef){ super.actionTemplate = componentRef.actionTemplate; }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){
        //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
        //this.coreState.orgUserId = this.coreService.currentUser.id;
      super.populateGrid();
    }

    actionCb(schedule: MyTaskSchedule){
        /*const { id, orgTaskId, isFeeTask, isManual, name, description } = schedule;
        const inputData: any = {
            id: id, //Schedular ID
            taskId: orgTaskId, //Org Task Id
            isManual: isManual,
            isFeeTask: isFeeTask
        };
        this.apiResolver.showSchedulerPopup(inputData, { text: `${name}`, desc: `${description}` });*/
    }

    // actionCb(schedule: OrgTaskSchedule){
    //     const { id, orgTaskId, isFeeTask, isManual } = schedule;
    //     const popup = {
    //         header: { text: `${schedule.name}`, desc: `Schedule - ${ACTION_ENUM.UPDATE} Scheduler` },
    //         aside: ASIDE_CLASS.RIGHT,
    //         size: ASIDE_SIZE.W_50
    //     };
    //     const inputData: any = {
    //         id: id, //Schedular ID
    //         taskId: orgTaskId, //Org Task Id
    //         isManual: isManual,
    //         isFeeTask: isFeeTask
    //     };
    //
    //     const success = (resp: any) => {
    //         this.populateGrid();
    //         this.pluginFactory.destroy();
    //     };
    //
    //     const failure = (resp: any) => {
    //         this.pluginFactory.destroy();
    //     };
    //     this.pluginFactory.showSchedulerPopup(inputData, popup).then(success, failure);
    // }
}
