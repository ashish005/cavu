import {CoreResource} from "@app-global";

export class LookupProcessPhase {
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    color: string;

    constructor(model: any = <any>{}){
        const {id, name, description, sortOrder, isDefault, color} = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.color = color;
    }
}
export class LookupProcessStatus {
    id: number;
    name: string;
    sortOrder: number;

    constructor(model: any = <any>{}){
        const {id, name, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
    }
}

export class LookupTaskPriority {
    id: number;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    color: string;

    constructor(model: any = <any>{}){
        const {id, name, description, sortOrder, isDefault, color} = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.color = color;
    }
}
export class LookupTaskStatus {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    isDefault: boolean;
    color: string;

    constructor(model: any = <any>{}){
        const {id, name, description, sortOrder, isDefault, color} = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.sortOrder = sortOrder;
        this.isDefault = isDefault;
        this.color = color;
    }
}

export class LookupProjectPhase {
    id: number;
    name: string;
    sortOrder: number;
    statusTypeId: number;
    statusTypeName: string;

    constructor(model: any = <any>{}){
        const {id, name, sortOrder, statusTypeId, statusTypeName} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.statusTypeId = statusTypeId;
        this.statusTypeName = statusTypeName;
    }
}

export class LookupProjectStatusType {
    id: number;
    name: string;
    sortOrder: number;
    projectPhases: Array<LookupProjectPhase>;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder } = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.projectPhases = [];
    }
}

export class LookupProjectType {
    id: number;
    name: string;
    constructor(model: any = {}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class LookupBillingType {
    id: number;
    name: string;
    constructor(model: any = {}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class LookupProjectDivision {
    id: any;
    name: string;
    constructor(model: any = {}){
        const {id, name} = model;
        this.id = id;
        this.name = name;
    }
}
export class LookupResourceType {
    id: any;
    name: string;
    description: string;
    constructor(model: any = {}){
        const {id, name, description} = model;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
export class LookupStatus {
    id: any;
    name: string;
    sortOrder: string;
    constructor(model: any = {}){
        const {id, name, sortOrder} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
    }
}

export class LookupRelationType extends CoreResource{
    override id: number;
    name: string;
    constructor(model: any = <any>{}){
        super();
        const { id, name } = model || {};
        this.id = id;
        this.name = name;
    }
}

export class LookupVoucherType {
    id: any;
    name: string;
    masterType: string;
    constructor(model: any = {}){
        const {id, name, masterType} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
    }
}

export class ProjectLookup extends CoreResource {
    projectTypes: Array<LookupProjectType>;
    voucherTypes: Array<LookupVoucherType>;
    billingTypes: Array<LookupBillingType>;
    voucherOptionTypes: Array<LookupVoucherType>;
    relationTypes: Array<LookupRelationType>;

    resourceTypes: Array<LookupResourceType>;
    divisions: Array<LookupProjectDivision>;
    status: Array<LookupStatus>;

    processPhases: Array<LookupProcessPhase>;
    processStatus: Array<LookupProcessStatus>;
    taskPriorities: Array<LookupTaskPriority>;
    taskStatus: Array<LookupTaskStatus>;

    projectPhases: Array<LookupProjectPhase> = [];
    projectStatusTypes: Array<LookupProjectStatusType> = [];
    constructor(model: any = <any>{}){
        super();
        const {
            projectTypes, voucherTypes, billingTypes, relationTypes, resourceTypes, divisions, status,
            projectPhases, projectStatusTypes,
            processStatus, processPhases, taskPriorities, taskStatus
        } = model;
        this.projectTypes = (projectTypes || []).map(r => new LookupProjectType(r));
        this.relationTypes = (relationTypes || []).map(r => new LookupRelationType(r));
        this.billingTypes = (billingTypes || []).map(r => new LookupBillingType(r));
        this.resourceTypes = (resourceTypes || []).map(r => new LookupResourceType(r));
        this.divisions = (divisions || []).map(r => new LookupProjectDivision(r));
        this.status = (status || []).map(r => new LookupStatus(r));

        const vOptionTypes = <any>{
            'payment': true,
            'receipt': true,
            'contra': true,
            'journal': true,
            'sale': true,
            'purchase': true
        };
        this.voucherOptionTypes = (voucherTypes || []).filter(r => vOptionTypes[r.masterType]);

        this.processStatus = (processStatus || []).map(r => new LookupProcessStatus(r));
        this.processPhases = (processPhases || []).map(r => new LookupProcessPhase(r));

        this.taskPriorities = (taskPriorities || []).map(r => new LookupTaskPriority(r));
        this.taskStatus = (taskStatus || []).map(r => new LookupTaskStatus(r));

        this.projectPhases = (projectPhases || []).map(r => new LookupProjectPhase(r));
        this.projectStatusTypes = (projectStatusTypes || []).map(r => new LookupProjectStatusType(r));
    }

    getVoucherTypeById(typId: number){
        return this.voucherTypes.find(r => r.id == typId) || new LookupVoucherType();
    }

    findVoucherTypeByName(masterType){
        return this.voucherTypes.find(r => r.masterType == masterType);
    }
}

export class ProjectLookupSerializer {
  fromJson(json: any): ProjectLookup { return new ProjectLookup(json); }
  toJson(data: any): any { return null; }
}
