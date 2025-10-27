import {CoreQueryOptions} from "@app-global";

export class ComplianceReportQueryOptions extends CoreQueryOptions{
    startDate: string;
    endDate: string;

    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            fromDate: this.startDate,
            toDate: this.endDate
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class ComplianceDetail {
    name: string;
    isValid: boolean;
    complianceStatus: number;
    complianceStatusName: number;
    dueDate: string;
    fulfilmentDate: string;
    complianceDetailId: number;

    lastDueAmount: number;
    saleAmount: number;
    taxAmount: number;

    rebateAmount: number;
    availableInputAmount: number;
    netPayableAmount: number;
    netPaidAmount: number;

    empExecutiveId: number;
    empExecutiveName: number;

    constructor(model: any = <any>{}){
        const { name, isValid, complianceStatus, complianceStatusName, dueDate, fulfilmentDate, complianceDetailId,
            lastDueAmount, saleAmount, taxAmount, rebateAmount, availableInputAmount, netPayableAmount, netPaidAmount,
            empExecutiveId, empExecutiveName
        } = model;
        this.name = name;
        this.isValid = isValid;
        this.complianceStatus = complianceStatus;
        this.complianceStatusName = complianceStatusName;
        this.dueDate = dueDate;
        this.fulfilmentDate = fulfilmentDate;
        this.complianceDetailId = complianceDetailId;
        this.lastDueAmount = lastDueAmount;
        this.saleAmount = saleAmount;
        this.taxAmount = taxAmount;
        this.rebateAmount = rebateAmount;
        this.availableInputAmount = availableInputAmount;
        this.netPayableAmount = netPayableAmount;
        this.netPaidAmount = netPaidAmount;

        this.empExecutiveId = empExecutiveId;
        this.empExecutiveName = empExecutiveName;
    }
}

export class ComplianceReport {
  id: number;
  complianceName: string;
  complianceTypeId: number;
  complianceTypeName: string;
  orgTaskScheduleId: number;
  regulatoryName: string;

  totalCount: number;
  compliantCount: number;
  pendingCount: number;
  scheduledDates: Array<ComplianceDetail>;

  constructor(model: any = <any>{}){
    const {
        id, complianceName, complianceTypeId, complianceTypeName, orgTaskScheduleId, regulatoryName,
        pendingCount, totalCount, compliantCount,
        scheduledDates
    } = model;
    this.id = id;
    this.complianceName = complianceName;
    this.complianceTypeId = complianceTypeId;
    this.complianceTypeName = complianceTypeName;
    this.orgTaskScheduleId = orgTaskScheduleId;
    this.regulatoryName = regulatoryName;

    this.pendingCount = pendingCount;
    this.totalCount = totalCount;
    this.compliantCount = compliantCount;

    this.scheduledDates = (scheduledDates || []).map(r => new ComplianceDetail(r));
  }

  get completionPercentage() { return (this.compliantCount > 0) ? ((this.compliantCount/(this.totalCount || 1))*100).toFixed(2) : 0; }
}

export class ComplianceReportSerializer{
  fromJson(json: any): ComplianceReport {
    return new ComplianceReport(json);
  }

  toJson(data: any): any { return data; }
}
