import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SchedulerService} from "../services/scheduler.service";
import {
    ScheduledEndDateCell, ScheduledNameActionCell,
    ScheduledStartDateCell,
    ScheduledTaskLastRunCell
} from "../grid-cells/scheduled-grid-cell.component";
import {FullDateFormatCell, ViewExtender} from "@app-global";
import {Scheduler, SchedulerQueryOptions} from "../domains/scheduler.serializer";
import {PipelineAPIResolver} from "../resolver/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/scheduled.html',
  styles: [':host { display: contents; }']
})
export class TaskScheduleView extends ViewExtender<Scheduler> implements OnInit, OnDestroy {
  override coreState: SchedulerQueryOptions = new SchedulerQueryOptions();
  constructor(private router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: SchedulerService,
              public lookupResolver: PipelineAPIResolver){
  super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name', cellTemplate: ScheduledNameActionCell },
            //{headerName: 'Task', field: 'taskName'},
            {headerName: 'Frequency', field: 'frequencyTypeName'},
            {headerName: 'Priority', field: 'taskPriorityName'},
            {headerName: 'Start On', cellTemplate: ScheduledStartDateCell},
            {headerName: 'End On', cellTemplate: ScheduledEndDateCell},
            {headerName: 'Last Run', field: 'lastRun', cellTemplate: ScheduledTaskLastRunCell},
            {headerName: 'Today run', field: 'todayRun', cellTemplate: ScheduledTaskLastRunCell},
            {headerName: 'Next Run', field: 'nextRun', cellTemplate: ScheduledTaskLastRunCell},
            {headerName: 'nextDueDate', field: 'nextDueDate', cellTemplate: FullDateFormatCell}
        ];
    }

    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){ super.populateGrid(); }

    actionCb(schedule: Scheduler){
        const { id, orgTaskId, isFeeTask, isManual, name, description } = schedule;
        const inputData: any = {
            id: id, //Schedular ID
            orgTaskId: orgTaskId, //Org Task Id
            isManual: isManual,
            isFeeTask: isFeeTask
        };
        this.lookupResolver.showSchedulerPopup(inputData, { text: `${name}`, desc: `` }, ()=>{
          super.populateGrid();
        });
    }
}
