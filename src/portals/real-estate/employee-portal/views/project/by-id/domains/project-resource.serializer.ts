import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProjectResourceQueryOptions extends CoreQueryOptions{
    projectId: string;
    customerId: string;
    accountId: string;
    moduleId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            customerId:this.customerId,
            accountId:this.accountId,
            moduleId: this.moduleId,
            userType: 'employee'
        };
        return super.getParamByObject(obj);
    }
}

export class ProjectResource extends CoreResource {
    name: string;
    description: string;

    projectId: string;
    moduleId: number;

    vendorExecutiveId: string;
    empExecutiveId: string;

    resourceTypeId: number;
    billingTypeId: number;
    purchaseOrderId: number;

    estimatedCost: number;
    estimatedStartDate: number;

    approvedCost: number;
    actualStartDate: string;
    statusRemark: string;

    auditedById: number;
    auditedDate: string;
    auditerRemark: string;

    empExecutive: string;
    vendorExecutive: string;
    purchaseOrder: string;
    resourceType: string;
    project: string;
    projectModule: string;
    billingType: string;

    constructor(model: any = <any>{}){
        super();
        const
        {
            id, name, description,
            projectId, moduleId, vendorExecutiveId, empExecutiveId,
            resourceTypeId, billingTypeId, purchaseOrderId, estimatedCost, estimatedStartDate,
            approvedCost, actualStartDate, statusRemark,
            auditedById, auditedDate, auditerRemark,
            empExecutive, vendorExecutive, purchaseOrder,
            resourceType, billingType, project, projectModule
        } = model;

        this.id = id;
        this.name = name;
        this.description = description;

        this.projectId = projectId;
        this.moduleId = moduleId;
        this.vendorExecutiveId = vendorExecutiveId;
        this.empExecutiveId = empExecutiveId;

        this.resourceTypeId = resourceTypeId;
        this.billingTypeId = billingTypeId;
        this.purchaseOrderId = purchaseOrderId;
        this.estimatedCost = estimatedCost;
        this.estimatedStartDate = estimatedStartDate;

        this.approvedCost = approvedCost;
        this.actualStartDate = actualStartDate;
        this.statusRemark = statusRemark;
        this.auditedById = auditedById;
        this.auditedDate = auditedDate;
        this.auditerRemark = auditerRemark;

        this.empExecutive = empExecutive;
        this.vendorExecutive = vendorExecutive;
        this.purchaseOrder = purchaseOrder;
        this.resourceType = resourceType;
        this.billingType = billingType;
        this.project = project;
        this.projectModule = projectModule;
    }
}

export class ProjectResourceSerializer {
    fromJson(json: any): ProjectResource { return new ProjectResource(json); }
    toJson(model: any): any { return model; }
}
