import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {FrequencyType, FrequencyTypeSerializer} from "../domains/frequency-type.serializer";
import {TaskPriority, TaskPrioritySerializer} from "../domains/task-priority.serializer";
import {TaskStatusType, TaskStatusTypeSerializer} from "../domains/task-status-type.serializer";
import {WorkflowPhaseStatus, WorkflowPhaseStatusSerializer} from "../domains/workflow-phase-status.serializer";
import {OrgWorkflowPhase, OrgWorkflowPhaseSerializer} from "../../workflow/domains/org-workflow-node.serializer";

@Injectable()
export class FrequencyTypeService extends OrgResourceService<FrequencyType>{
    constructor(public override injector: Injector) { super(injector, 'frequencyType', new FrequencyTypeSerializer()); }
}

@Injectable()
export class WorkflowPhaseStatusService extends OrgResourceService<WorkflowPhaseStatus> {
    constructor(public override injector: Injector) { super(injector, 'orgWorkflowPhaseStatus', new WorkflowPhaseStatusSerializer()); }
}

@Injectable()
export class TaskPriorityService extends OrgResourceService<TaskPriority> {
    constructor(public override injector: Injector) { super(injector, 'taskPriority', new TaskPrioritySerializer()); }
}

@Injectable()
export class TaskStatusTypeService extends OrgResourceService<TaskStatusType> {
    constructor(public override injector: Injector) { super(injector, 'taskStatusType', new TaskStatusTypeSerializer()); }
}

@Injectable()
export class OrgWorkflowPhaseService extends OrgResourceService<OrgWorkflowPhase> {
    constructor(public override injector: Injector) { super(injector, 'OrgWorkflowPhase', new OrgWorkflowPhaseSerializer()); }
}
