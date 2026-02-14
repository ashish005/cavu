import {CoreQueryOptions, CoreResource} from "@app-global";
import {OrgWorkflowPhase} from "./org-workflow-node.serializer";

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

export class OrgWorkflow extends CoreResource {
    name: string;
    description: string;
    sortOrder: number;
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
    notifications?: any[];
    constructor(model: any = <any>{}){
        super();
        const {
            id, name, description, sortOrder,
            parentId, parentName,
            //processPhase, processPhaseOn, manualStatus, manualStatusOn,
            inchargeId, inchargeName, processStatus, phases,
            isLocked, isActive, notification, notificationTemplates, notifications
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
        this.notifications = notifications;
    }
}

export class OrgWorkflowSerializer {
    fromJson(json: any): OrgWorkflow { return new OrgWorkflow(json); }
    toJson(data: any): any { return data; }
}