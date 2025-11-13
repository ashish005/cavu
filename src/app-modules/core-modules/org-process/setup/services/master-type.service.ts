import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {FrequencyType, FrequencyTypeSerializer} from "../domains/frequency-type.serializer";
import {TaskPriority, TaskPrioritySerializer} from "../domains/task-priority.serializer";
import {TaskStatusType, TaskStatusTypeSerializer} from "../domains/task-status-type.serializer";
import {ProcessPhase, ProcessPhaseSerializer} from "../domains/process-phase.serializer";

@Injectable()
export class FrequencyTypeService extends OrgResourceService<FrequencyType>{
    constructor(public override injector: Injector) { super(injector, 'frequencyType', new FrequencyTypeSerializer()); }
}

@Injectable()
export class ProcessPhaseService extends OrgResourceService<ProcessPhase> {
    constructor(public override injector: Injector) { super(injector, 'masterType/ProcessPhase', new ProcessPhaseSerializer()); }
}

@Injectable()
export class TaskPriorityService extends OrgResourceService<TaskPriority> {
    constructor(public override injector: Injector) { super(injector, 'masterType/TaskPriority', new TaskPrioritySerializer()); }
}

@Injectable()
export class TaskStatusTypeService extends OrgResourceService<TaskStatusType> {
    constructor(public override injector: Injector) { super(injector, 'masterType/TaskStatusType', new TaskStatusTypeSerializer()); }
}
