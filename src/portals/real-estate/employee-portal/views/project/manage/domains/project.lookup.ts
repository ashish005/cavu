import {CoreResource} from "@app-global";

export class OrgWorkflowPhaseLookup {
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

export class LookupProjectStatusType {
    id: number;
    name: string;
    sortOrder: number;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder } = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
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

    phases: Array<OrgWorkflowPhaseLookup>;
    phasesStatus: Array<LookupProcessStatus>;
    taskPriorities: Array<LookupTaskPriority>;
    taskStatus: Array<LookupTaskStatus>;

    projectStatusTypes: Array<LookupProjectStatusType> = [];
    constructor(model: any = <any>{}){
        super();
        const {
            projectTypes, voucherTypes, billingTypes, relationTypes, resourceTypes, divisions, status,
            projectStatusTypes,
            phasesStatus, phases, taskPriorities, taskStatus
        } = model;
        this.projectTypes = (projectTypes || []).map((r: any) => new LookupProjectType(r));
        this.status = (status || []).map((r: any) => new LookupStatus(r));

        this.projectStatusTypes = (projectStatusTypes || []).map((r: any) => new LookupProjectStatusType(r));

        this.voucherTypes = (voucherTypes || []).map((r: any) => new LookupVoucherType(r));
        const vOptionTypes: any = {
            "QUOTATION": true, "PAYMENT": true, "INVOICE": true
        };
        this.voucherOptionTypes = (voucherTypes || []).filter((r: any) => vOptionTypes[r.masterType]);

        this.phasesStatus = (phasesStatus || []).map((r: any) => new LookupProcessStatus(r));
        this.phases = (phases || []).map((r: any) => new OrgWorkflowPhaseLookup(r));

        this.taskPriorities = (taskPriorities || []).map((r: any) => new LookupTaskPriority(r));
        this.taskStatus = (taskStatus || []).map((r: any) => new LookupTaskStatus(r));

        this.billingTypes = (billingTypes || []).map((r: any) => new LookupBillingType(r));
        this.relationTypes = (relationTypes || []).map((r: any) => new LookupRelationType(r));
        this.resourceTypes = (resourceTypes || []).map((r: any) => new LookupResourceType(r));
        this.divisions = (divisions || []).map((r: any) => new LookupProjectDivision(r));
    }

    getVoucherTypeByMasterType(masterType: any)
    {
        return (this.voucherTypes || []).find(r => r.masterType == masterType);
    }
}

export class ProjectLookupSerializer {
  fromJson(json: any): ProjectLookup { return new ProjectLookup(json); }
  toJson(data: any): any { return null; }
}
