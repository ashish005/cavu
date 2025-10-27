import { CoreQueryOptions, CoreResource } from "@app-global";

export class ProjectModuleQueryOptions extends CoreQueryOptions{
    projectId: string;
    accountId: string;
    moduleId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            accountId:this.accountId,
            moduleId: this.moduleId
        };
        return super.getParamByObject(obj);
    }
}

class VoucherSummaryInfo {
    id: string;
    voucherNo: string;
    voucherDate: string;
    netAmount: number;
    voucherTypeId: number;
    voucherMasterType: string;
    subType: number;

    constructor(model: any = <any>{}){
        const { id, voucherNo, voucherDate, netAmount, voucherTypeId, voucherMasterType, subType } = model;
        this.id = id;
        this.voucherNo = voucherNo;
        this.voucherDate = voucherDate;
        this.netAmount = netAmount;
        this.voucherTypeId = voucherTypeId;
        this.voucherMasterType = voucherMasterType;
        this.subType = subType;
    }
}

export class ProjectModule extends CoreResource {
    name: string;
    description: string;

    divisionId: number;
    projectId: string;
    quotationId: string;
    saleOrderId: number;
    empExecutiveId: number;

    estimatedCost: number;
    estimatedStartDate: string;
    approvedCost: number;
    actualStartDate: string;

    statusRemark: string;
    auditedById: string;
    auditedDate: string;
    auditerRemark: string;
    status: string;

    division: string;
    auditedBy: string;
    empExecutive: string;
    quotationInfo: VoucherSummaryInfo;
    saleOrderInfo: VoucherSummaryInfo;
    //userAudit: UserAuditInfo;

    constructor(model: any = <any>{}){
        const {
            id, name, description,
            divisionId, projectId, quotationId, saleOrderId, empExecutiveId,
            estimatedCost, estimatedStartDate, approvedCost, actualStartDate,
            statusRemark, auditedById, auditedDate, auditerRemark,
            status, division, auditedBy, empExecutive, quotationInfo, saleOrderInfo
        } = model;
        super();
        this.id = id;
        /* edit begin */
        this.name = name;
        this.description = description;
        this.divisionId = divisionId;
        this.projectId = projectId;
        this.quotationId = quotationId;
        this.saleOrderId = saleOrderId;
        this.empExecutiveId = empExecutiveId;

        this.estimatedCost = estimatedCost;
        this.estimatedStartDate = estimatedStartDate;
        this.approvedCost = approvedCost;
        this.actualStartDate = actualStartDate;

        /* edit ends */
        this.statusRemark = statusRemark;
        this.auditedById = auditedById;
        this.auditedDate = auditedDate;
        this.auditerRemark = auditerRemark;

        this.status = status;
        this.division = division;
        this.auditedBy = auditedBy;
        this.empExecutive = empExecutive;
        this.quotationInfo = new VoucherSummaryInfo(quotationInfo);
        this.saleOrderInfo = new VoucherSummaryInfo(saleOrderInfo);
        //this.userAudit = new UserAuditInfo(userAuditInfo);
    }
}

export class ProjectModuleSerializer {
    fromJson(json: any): ProjectModule {
        return new ProjectModule(json);
    }
    toJson(model: any): any {
        const {id, name, description, projectDivisionId, saleOrderId, projectId} = model;

        /*return {
            name: name,
            description: description,
            projectDivisionId: projectDivisionId,
            projectId: projectId
        };*/
        return model;
    }
}
