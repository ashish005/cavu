import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SchedulerService} from "../services/scheduler.service";
import {ViewExtender} from "@app-global";
import {Scheduler, SchedulerQueryOptions} from "../domains/scheduler.serializer";
import {TaskAPIResolver, TaskByIdAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/schedule.html',
  styles: [':host { display: contents; }']
})
export class ScheduleView extends ViewExtender<Scheduler> implements OnInit, OnDestroy {
  override coreState: SchedulerQueryOptions = new SchedulerQueryOptions();
  constructor(public activatedRoute: ActivatedRoute,
              public service: SchedulerService,
              public resolver: TaskByIdAPIResolver){
  super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'Frequency Type', field: 'frequencyTypeName'},
            {headerName: 'Priority', field: 'taskPriority'},
            {headerName: 'Start On', field: 'startDate'},
            {headerName: 'End On', field: 'endDate'},
            // {headerName: 'Last Run', field: 'lastRun', cellTemplate: ScheduledTaskLastRunCell},
            // {headerName: 'Today run', field: 'todayRun', cellTemplate: ScheduledTaskLastRunCell},
            // {headerName: 'Next Run', field: 'nextRun', cellTemplate: ScheduledTaskLastRunCell}
        ];
    }

    onActivate(componentRef){
        super.actionTemplate = componentRef.actionTemplate;
    }

    ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){
        this.coreState.orgTaskId = this.resolver.data.id;
        super.populateGrid();
    }

    actionCb(schedule: Scheduler){
        // const { id, orgTaskId, isFeeTask, isManual, name, description } = schedule;
        // const inputData: any = {
        //     id: id, //Schedular ID
        //     orgTaskId: orgTaskId, //Org Task Id
        //     isManual: isManual,
        //     isFeeTask: isFeeTask
        // };
        // this.lookupResolver.showSchedulerPopup(inputData, { text: `${name}`, desc: `${description}` });
    }

    addSchedule(){
        const { id, isFeeTask, isManual, isPeriodType, isPrimary } = this.resolver.data;
        const inputData: any = {
            id: null, //Schedular ID
            orgTaskId: id,
            isManual: isManual,
            isFeeTask: isFeeTask
        };
        //this.resolver.showSchedulerPopup(inputData, { text: `New Scheduler`, desc: `` });
        this.resolver.showEventTaskSchedulerPopup(inputData, { text: `New Scheduler`, desc: `` });
    }
}
