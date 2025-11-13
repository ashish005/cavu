import {CoreQueryOptions} from "../../../../services/models";
import { WorkflowOrgTask} from "./process-workflow.serializer";
export class ProcessWorkflowAdvanceQueryOptions extends CoreQueryOptions{
    parentId: number;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            parentId: this.parentId
        };
        return super.getParamByObject(obj);
    }
}
export class WorkflowLookupStages {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class WorkflowLookupStatus {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class ProcessWorkflowLookup {
    phases: Array<WorkflowLookupStages>;
    phaseStatuses: Array<WorkflowLookupStatus>;
    constructor(model: any = <any>{}){
        const { phases, phaseStatuses } = model;
        this.phases = (phases || []).map(r => new WorkflowLookupStages(r));
        this.phaseStatuses = (phaseStatuses || []).map(r => new WorkflowLookupStatus(r));
    }
}
class ProcessWorkflowPhaseTransition{
    toPhaseId: number;
    toPhaseName: string;
    toPhaseStatusId: number;
    toPhaseStatusName: string;
    constructor(model: any = <any>{}) {
        const {toPhaseId, toPhaseName, toPhaseStatusId, toPhaseStatusName} = model;
        this.toPhaseId = toPhaseId;
        this.toPhaseName = toPhaseName;
        this.toPhaseStatusId = toPhaseStatusId;
        this.toPhaseStatusName = toPhaseStatusName;
    }
}
export class ProcessWorkflowPhase{
    id: number;
    name: string;
    phaseStatusId: number;
    phaseStatusName: string;
    color: string;
    phaseTransitions: Array<ProcessWorkflowPhaseTransition>;
    constructor(model: any = <any>{}){
        const {
            id, name, startPhaseName, color, phaseStatusId, phaseStatusName, phaseTransitions
        } = model;

        this.id = id;
        this.name = name;
        this.phaseStatusId = phaseStatusId;
        this.phaseStatusName = phaseStatusName;
        this.color = color;
        this.phaseTransitions = (phaseTransitions || []).map(r => new ProcessWorkflowPhaseTransition(r));
    }
}
export class ProcessWorkflowAdvance {
    id: any;
    name: string;
    description: string;
    parentId: number;
    sortOrder: string;
    masterType: string;

    processPhase: string;
    processPhaseOn: string;
    manualStatus: string;
    manualStatusOn: string;
    inchargeId: number;
    inchargeName: string;
    isLocked: boolean;
    status: string;
    tasks: Array<WorkflowOrgTask>;

    orgProcessId: number;
    nextOrgProcessId: number;
    startPhaseId: number;
    endPhaseId: number;

    nextOrgProcessName: string;
    startPhaseName: string;
    endPhaseName: string;
    childItems: Array<ProcessWorkflowAdvance>;
    phases: Array<ProcessWorkflowPhase>;
    constructor(model: any = <any>{}){
        const {
            id, name, description, parentId, sortOrder, masterType,
            processPhase, processPhaseOn, manualStatus, manualStatusOn,
            inchargeId, inchargeName,
            isLocked, status
        } = model;

        this.id = id;
        this.name = name;
        this.description = description;

        this.masterType = masterType;
        this.parentId = parentId;
        this.sortOrder = sortOrder;

        this.processPhase = processPhase;
        this.processPhaseOn = processPhaseOn;
        this.manualStatus = manualStatus;
        this.manualStatusOn = manualStatusOn;
        this.inchargeId = inchargeId;
        this.inchargeName = inchargeName;
        this.isLocked = isLocked;
        this.status = status;
        const { childItems, phases, tasks } = model;
        this.tasks = (tasks || []).map(r => new WorkflowOrgTask(r));
        this.childItems = (childItems || []).map(r => new ProcessWorkflowAdvance(r));
        this.phases = (phases || []).map(r => new ProcessWorkflowPhase(r));
    }
}
export class ProcessWorkflowAdvanceSerializer {
    fromDataJson(json: any) { return new ProcessWorkflowLookup(json); }
    fromJson(json: any): ProcessWorkflowAdvance { return new ProcessWorkflowAdvance(json); }
    toJson(model: any): any {return model;}
}