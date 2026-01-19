import {CoreQueryOptions, CoreResource} from "@app-global";

export class OrgWorkflowsQueryOptions extends CoreQueryOptions{
    parentId?: number | string;
    constructor(model: any = {}){ super(model); }
    override toQueryString (){
        const obj = {
            parentId:this.parentId
        };
        return super.getParamByObject(obj);
    }
}

class OrgWorkflowPhaseStepRole {
    id: number;
    propertyName: string;
    operator: string;
    value: string;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const { id, propertyName, operator, value, isActive, rules } = model;
        this.id = id;
        this.propertyName = propertyName;
        this.operator = operator;
        this.value = value;
        this.isActive = isActive;
    }
}

class OrgWorkflowPhaseStep {
    id: number;
    name: string;
    assignedToRole: string;
    stepOrder: number;
    isActive: boolean;
    rules: Array<OrgWorkflowPhaseStepRole>;
    constructor(model: any = <any>{}){
        const { id, name, assignedToRole, stepOrder, isActive, rules } = model;
        this.id = id;
        this.name = name;
        this.assignedToRole = assignedToRole;
        this.stepOrder = stepOrder;
        this.isActive = isActive;
        this.rules = (rules || []).map(r => new OrgWorkflowPhaseStepRole(r));
    }
}

class OrgWorkflowPhase {
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    phaseStatusId: number;
    phaseStatusName: string;
    color: string;
    isActive: boolean;
    steps: Array<OrgWorkflowPhaseStep>;
    constructor(model: any = <any>{}){
        const {
            id, name, description, sortOrder, isDefault, color,
            phaseStatusId, phaseStatusName, steps,
            isActive
        } = model;

        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.phaseStatusId = phaseStatusId;
        this.phaseStatusName = phaseStatusName;
        this.color = color;
        this.isActive = isActive;
        this.steps = (steps || []).map(r => new OrgWorkflowPhaseStep(r));
    }
}

export class OrgWorkflow extends CoreResource {
    name: string;
    description: string;
    sortOrder: string;
    parentId: number;
    parentName: string;
    // processPhase: string;
    // processPhaseOn: string;
    // manualStatus: string;
    // manualStatusOn: string;
    inchargeId: number;
    inchargeName: string;
    processStatus: string;
    isLocked: boolean;
    isActive: boolean;
    phases: Array<OrgWorkflowPhase>;
    notification?: {
        notifyOnEnter: boolean;
        notifyOnExit: boolean;
        channels: string[];
        message: string;
    };
    notificationTemplates?: any[];
    constructor(model: any = <any>{}){
        super();
        const {
            id, name, description, sortOrder,
            parentId, parentName,
            //processPhase, processPhaseOn, manualStatus, manualStatusOn,
            inchargeId, inchargeName, processStatus, phases,
            isLocked, isActive, notification, notificationTemplates
        } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.parentId = parentId || 0;
        this.parentName = parentName;
        // this.processPhase = processPhase;
        // this.processPhaseOn = processPhaseOn;
        // this.manualStatus = manualStatus;
        // this.manualStatusOn = manualStatusOn;
        this.inchargeId = inchargeId;
        this.inchargeName = inchargeName;
        this.processStatus = processStatus;
        this.isLocked = isLocked;
        this.isActive = isActive;
        this.phases = (phases || []).map((r: any) => new OrgWorkflowPhase(r));
        this.notification = notification;
        this.notificationTemplates = notificationTemplates;
    }
}

export class OrgWorkflowSerializer {
    fromJson(json: any): OrgWorkflow { return new OrgWorkflow(json); }
    toJson(data: any): any { return data; }
}