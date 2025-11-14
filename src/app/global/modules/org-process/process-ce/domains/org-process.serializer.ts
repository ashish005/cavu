import {CoreQueryOptions} from "../../../../services/models";
export class OrgProcessQueryOptions extends CoreQueryOptions{
    parentId: number;
    processMasterType: string;
    override toQueryString (){
        const obj = {
            parentId: this.parentId,
            processMasterType: this.processMasterType
        };
        return super.getParamByObject(obj);
    }
}

class OrgPhaseTransition{
    id: number;
    toPhaseId: number;
    toPhaseName: string;
    toPhaseStatusId: number;
    toPhaseStatusName: string;
    isActive: boolean;
    constructor(model: any = <any>{}) {
        const { id, toPhaseId, toPhaseName, toPhaseStatusId, toPhaseStatusName, isActive} = model;
        this.id = id;
        this.toPhaseId = toPhaseId;
        this.toPhaseName = toPhaseName;
        this.toPhaseStatusId = toPhaseStatusId;
        this.toPhaseStatusName = toPhaseStatusName;
        this.isActive = isActive;
    }
}

class OrgProcessPhase{
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    phaseStatusId: number;
    phaseStatusName: string;
    color: string;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, sortOrder, isDefault, color, phaseStatusId, phaseStatusName, isActive
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
    }
}
export class OrgProcess {
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

    childItems: Array<OrgProcess>;
    //tasks: Array<OrgProcessTask>;
    phases: Array<OrgProcessPhase>;
    phaseTransitions: Array<OrgPhaseTransition>;
    constructor(model: any = <any>{}){
        const {
            id, name, description, parentId, sortOrder, masterType,
            processPhase, processPhaseOn, manualStatus, manualStatusOn,
            inchargeId, inchargeName,
            isLocked, status,
            childItems, tasks, phases, phaseTransitions
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

        this.childItems = (childItems || []).map(r => new OrgProcess(r));
        this.phases = (phases || []).map(r => new OrgProcessPhase(r));
        this.phaseTransitions = (phaseTransitions || []).map(r => new OrgPhaseTransition(r));
    }
}

export class OrgProcessSerializer {
    fromJson(json: any): OrgProcess { return new OrgProcess(json); }
    toJson(data: any): any { return data; }
}