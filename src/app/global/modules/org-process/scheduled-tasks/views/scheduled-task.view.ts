import {AfterViewInit, Component, Injectable, Injector, OnInit} from "@angular/core";
import {TaskScheduled, TaskScheduledQueryOptions, TaskScheduledSerializer} from "../domains/task-scheduled.serializer";
import {CoreSectorResourceService, ViewExtender} from "../../../../core-setup";
import {map} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable()
export class OrgScheduledTaskService extends CoreSectorResourceService<TaskScheduled>{
    constructor(public injector: Injector) { super(injector, 'taskSchedulerSummary/log', new TaskScheduledSerializer()); }
}
@Component({
    selector: 'task-scheduled-list',
    templateUrl: './templates/task-scheduled-list.html',
    styles: [`:host { display: contents; }`],
    providers: [OrgScheduledTaskService]
})
export class TaskScheduledListComponent extends ViewExtender<TaskScheduled> implements OnInit {
    coreState: TaskScheduledQueryOptions;
    constructor(public activatedRoute: ActivatedRoute, public service: OrgScheduledTaskService){
        super(new TaskScheduledQueryOptions(), activatedRoute, service);
    }
    ngOnInit(){ this.populateGrid(); }

    onSchedulechange(e){
        this.coreState.nextDays = e;
        this.populateGrid();
    }
}