import {CoreQueryOptions, CoreResource} from "@app-global";

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

class ProjectModule {
    id: number;
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
            status, division, auditedBy, empExecutive, quotationInfo, saleOrderInfo, userAuditInfo
        } = model;

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

export class ProjectQueryOptions extends CoreQueryOptions{
  accountId: string;
  constructor(model: any = {}){ super(model); }

  override toQueryString (){
      const obj = {
          accountId:this.accountId
      };
      return super.getParamByObject(obj);
  }
}

export class ProjectTransaction extends CoreResource {
    name: string;
    voucherId: number;
    voucherTypeId: number;
    voucherType: string;
    voucherMasterType: string;
    customerId: string;
    projectId: string;
    constructor(model: any = <any>{}){
        super();
        const { id, name, voucherId, voucherTypeId, voucherType, voucherMasterType, customerId, projectId } = model;
        this.id = id;
        this.name = name;
        this.voucherId = voucherId;
        this.voucherTypeId = voucherTypeId;
        this.voucherType = voucherType;
        this.voucherMasterType = voucherMasterType;
        this.customerId = customerId;
        this.projectId = projectId;
    }
}

class Client {
    id: string;
    name: string;
    companyName: string;
    taxRegistrationNo: string;
    accountId: string;
    accountGroupId: number;
    email: string;
    phone: string;
    constructor(model: any = {}){
        const { id, name, companyName, taxRegistrationNo, accountId, accountGroupId, email, phone } = model;

        this.id = id;
        this.name = name;
        this.companyName = companyName;
        this.taxRegistrationNo = taxRegistrationNo;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;

        this.email = email;
        this.phone = phone;
    }
}

export class Project extends CoreResource {
  override id: any;
    name: string;
    shortName: string;
    code: string;
    description: string;
    customerId: string;
    managerId: string;
    billingTypeId: number;
    projectTypeId: number;
    divisionId: number;

    expectedStartDate: string;
    expectedDurationDays: string;
    expectedCost: number;

    approvedBudget: number;
    advanceAmount: number;

    startDate: string;
    endDate: string;

    receipt: number;
    expense: number;
    due: number;

    projectType: string;
    division: string;
    billingType: string;
    client: Client;
    manager: any;
    status: any;

    hasWorkFlow: boolean;
    hasMultiModule: boolean;
    modules: Array<ProjectModule>;
    //userAudit: UserAuditInfo;
  constructor(model: any = <any>{}){
    super();
    const {id,
        name, shortName, code, description,
        customerId, managerId, billingTypeId, projectTypeId, divisionId,
        expectedStartDate, expectedDurationDays, expectedCost, approvedBudget, advanceAmount,
        startDate, endDate, receipt, expense, due,
        projectType, division, billingType, client, manager,
        status, modules, userAuditInfo,
        hasWorkFlow, hasMultiModule
    } = model;
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.code = code;
    this.description = description;

      this.customerId = customerId;
      this.managerId = managerId;
      this.billingTypeId = billingTypeId;
      this.projectTypeId = projectTypeId;
      this.divisionId = divisionId;

    this.expectedStartDate = expectedStartDate;
    this.expectedDurationDays = expectedDurationDays;
    this.expectedCost = expectedCost;

    this.approvedBudget = approvedBudget;
    this.advanceAmount = advanceAmount;

    this.startDate = startDate;
    this.endDate = endDate;
    this.receipt = receipt;
    this.expense = expense;
    this.due = due;

    this.projectType = projectType;
    this.division = division;
    this.billingType = billingType;
    this.client = new Client(client);
    this.manager = manager;

    this.status = status;
    this.hasWorkFlow = hasWorkFlow;
    this.hasMultiModule = hasMultiModule;
    this.modules = (modules || []).map(r => new ProjectModule(r));
    //this.userAudit = new UserAuditInfo(userAuditInfo);
  }
}

export class ProjectSerializer {
  fromJson(json: any): Project {
    return new Project(json);
  }
  toJson(model: any): any {
      const {
          name, shortName, description,
          expectedStartDate, expectedDurationDays, expectedCost,
          divisionId, billingTypeId, code, projectTypeId,
          customerId, managerId,
          startDate, endDate,
          hasMultiModule, hasWorkFlow
      } = model;
    return {
      name: name,
      shortName: shortName,
      code: code,
      description: description,
      expectedStartDate: expectedStartDate,
      expectedDurationDays: expectedDurationDays,
      expectedCost: expectedCost,

      customerId: customerId,
      managerId: managerId,

      divisionId: divisionId,
      projectTypeId: projectTypeId,
      billingTypeId: billingTypeId,

      startDate: startDate,
      endDate: endDate,

      hasMultiModule: hasMultiModule,
      hasWorkFlow: hasWorkFlow
    };
  }
}
