import {AfterViewInit, Component, Injectable, Injector, OnInit} from "@angular/core";
import {TaskScheduled, TaskScheduledQueryOptions, TaskScheduledSerializer} from "../domains/task-scheduled.serializer";
import {ActivatedRoute} from "@angular/router";
import {OrgResourceService} from "../../../../services/endpoint-base.service";
import {ViewExtender} from "../../../../extender-classes";

@Injectable()
export class OrgScheduledTaskService extends OrgResourceService<TaskScheduled>{
    constructor(public override injector: Injector) { super(injector, 'taskSchedulerSummary/log', new TaskScheduledSerializer()); }
}
@Component({
    standalone: false,
    selector: 'task-scheduled-list',
    templateUrl: './templates/task-scheduled-list.html',
    styles: [`:host { display: contents; }`],
    providers: [OrgScheduledTaskService]
})
export class TaskScheduledListComponent extends ViewExtender<TaskScheduled> implements OnInit {
    override coreState: TaskScheduledQueryOptions = new TaskScheduledQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute, public override service: OrgScheduledTaskService){
        super(activatedRoute, service);
    }
    ngOnInit(){ this.populateGrid(); }

    onSchedulechange(e){
        this.coreState.nextDays = e;
        this.populateGrid();
    }
}