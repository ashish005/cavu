import {CoreQueryOptions, CoreResource} from "@app-global";

export class PhaseQueryOptions extends CoreQueryOptions{
    workflowId: number | string;
    constructor(model: any = {}){ super(model); }
    override toQueryString (){
        const obj = {
            workflowId:this.workflowId
        };
        return super.getParamByObject(obj);
    }
}
export interface WorkflowNode {
    id: number;
    name: string;
    children?: WorkflowNode[];

    expanded?: boolean;
    level: number;
    hasChildren: boolean;
    permissions?: string[];
}

export interface PhaseTransition {
    id: number;
    processId: number;
    fromPhaseId: number;
    //fromStatusId?: number;
    toPhaseId: number;
    //toStatusId?: number;
    description?: string;
    rule?: string;
}

export class PhaseStep {
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    assignedToRole: string;
    slaHours: number;
    canAutoGenerateTask: boolean;
    phaseId: number;
    rules: PhaseStepRule[];

    isLocked: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, sortOrder, assignedToRole, slaHours,
            canAutoGenerateTask, phaseId, rules,
            isLocked, isActive
        } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.assignedToRole = assignedToRole;
        this.slaHours = slaHours;
        this.canAutoGenerateTask = canAutoGenerateTask;
        this.phaseId = phaseId;
        this.rules = (rules || []).map(r => new PhaseStepRule(r));
        this.isLocked = isLocked;
        this.isActive = isActive;
    }
}

export class PhaseStepRule {
    id: number;
    propertyName: string;
    operator: string;
    value: string;
    ruleJoinType: string;

    stepId: number;

    isLocked: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, propertyName, operator, value, ruleJoinType, stepId,
            isLocked, isActive
        } = model;
        this.id = id;
        this.propertyName = propertyName;
        this.operator = operator;
        this.value = value;
        this.stepId = stepId;
        this.ruleJoinType = ruleJoinType;
        this.isLocked = isLocked;
        this.isActive = isActive;
    }
}

export class PhaseStatus {
    id: number;
    phaseId: number;
    name: string;
    color?: string;
    slaHours: number;
    isLocked: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, color, phaseId, slaHours,
            isLocked, isActive
        } = model;
        this.id = id;
        this.name = name;
        this.color = color;
        this.phaseId = phaseId;

        this.slaHours = slaHours;
        this.isLocked = isLocked;
        this.isActive = isActive;
    }
}

export class Phase extends CoreResource {
    processId: number;
    override id: number;
    name: string;
    description: string;
    sortOrder: number;
    phaseStatusId: number;
    color: string;
    slaHours: number;
    position?: { x: number; y: number }; // optional for graph layout
    statuses: PhaseStatus[]; // statuses belonging to this phase
    steps: PhaseStep[];
    isLocked: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        super();
        const {
            processId, id, name, description, sortOrder,
            phaseStatusId, color, slaHours, statuses, steps,
            isLocked, isActive
        } = model;
        this.processId = processId;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.phaseStatusId = phaseStatusId;
        this.color = color;
        this.slaHours = slaHours;
        this.isLocked = isLocked;
        this.isActive = isActive;
        this.statuses = (statuses || []).map(r => new PhaseStatus(r));
        this.steps = (steps || []).map(r => new PhaseStep(r));
    }
}

export class PhaseSerializer {
    fromJson(json: any): Phase { return new Phase(json); }
    toJson(data: any): any { return data; }
}