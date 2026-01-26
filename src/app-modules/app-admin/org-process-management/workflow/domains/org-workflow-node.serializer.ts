import {CoreQueryOptions, CoreResource} from "@app-global";

export class OrgWorkflowPhaseQueryOptions extends CoreQueryOptions{
    workflowId?: number | string;
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
    
    notification?: {
        notifyOnEnter: boolean;
        notifyOnExit: boolean;
        channels: string[];
        message: string;
    };
    notificationTemplates?: any[];
    notifications?: any[];
}

export interface OrgWorkflowPhaseTransition {
    id: number;
    processId: number;
    fromPhaseId: number;
    //fromStatusId?: number;
    toPhaseId: number;
    //toStatusId?: number;
    description?: string;
    rule?: string;
}

export class OrgWorkflowPhaseStep {
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    assignedToRole: string;
    slaHours: number;
    canAutoGenerateTask: boolean;
    phaseId: number;
    rules: OrgWorkflowPhaseStepRule[];

    isLocked: boolean;
    isActive: boolean;
    notification?: {
        notifyOnEnter: boolean;
        notifyOnExit: boolean;
        channels: string[];
        message: string;
    };
    notificationTemplates?: any[];
    notifications?: any[];
    constructor(model: any = <any>{}){
        const {
            id, name, description, sortOrder, assignedToRole, slaHours,
            canAutoGenerateTask, phaseId, rules,
            isLocked, isActive, notification, notificationTemplates, notifications
        } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.assignedToRole = assignedToRole;
        this.slaHours = slaHours;
        this.canAutoGenerateTask = canAutoGenerateTask;
        this.phaseId = phaseId;
        this.rules = (rules || []).map((r: any) => new OrgWorkflowPhaseStepRule(r));
        this.isLocked = isLocked;
        this.isActive = isActive;
        this.notification = notification;
        this.notificationTemplates = notificationTemplates;
        this.notifications = notifications;
    }
}

export class OrgWorkflowPhaseStepRule {
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

export class OrgWorkflowPhaseStatus {
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

export class OrgWorkflowPhase extends CoreResource {
    processId: number;
    override id: number;
    name: string;
    description: string;
    sortOrder: number;
    phaseStatusId: number;
    phaseStatusName?: string;
    isDefault?: boolean;
    color: string;
    slaHours: number;
    position?: { x: number; y: number }; // optional for graph layout
    statuses: OrgWorkflowPhaseStatus[]; // statuses belonging to this phase
    steps: OrgWorkflowPhaseStep[];
    isLocked: boolean;
    isActive: boolean;
    notification?: {
        notifyOnEnter: boolean;
        notifyOnExit: boolean;
        channels: string[];
        message: string;
    };
    notificationTemplates?: any[];
    notifications?: any[];
    constructor(model: any = <any>{}){
        super();
        const {
            processId, id, name, description, sortOrder,
            phaseStatusId, phaseStatusName, isDefault, color, slaHours, statuses, steps,
            isLocked, isActive, notification, notificationTemplates, notifications
        } = model;
        this.processId = processId;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.phaseStatusId = phaseStatusId;
        this.phaseStatusName = phaseStatusName;
        this.isDefault = isDefault;
        this.color = color;
        this.slaHours = slaHours;
        this.isLocked = isLocked;
        this.isActive = isActive;
        this.statuses = (statuses || []).map((r: any) => new OrgWorkflowPhaseStatus(r));
        this.steps = (steps || []).map((r: any) => new OrgWorkflowPhaseStep(r));
        this.notification = notification;
        this.notificationTemplates = notificationTemplates;
        this.notifications = notifications;
    }
}

export class OrgWorkflowPhaseSerializer {
    fromJson(json: any): OrgWorkflowPhase { return new OrgWorkflowPhase(json); }
    toJson(data: any): any { return data; }
}