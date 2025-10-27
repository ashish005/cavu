import {CoreQueryOptions, CoreResource} from "@app-global";

export class ComplianceQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}

export class Compliance  extends CoreResource {
  public id: number;
  public name: string;
  public description: string;

  public complianceTypeId: number;
  public regulatoryId: number;

  public taxRegimeId: number;
  public subscriptionId: number;
  public taxRebateRate: number;
  public isExemptedForTaxation: number;

  public calculationType: number;
  public rate: number;

  public taskId: number;
  public orgTaskScheduleId: number;

  public empExecutiveId: string;
    // Just to show on ui

    public taskName: string;
    public complianceTypeName: string;
    public taxRegimeName: string;
    public subscriptionName: string;
    public empExecutiveName: string;
    public regulatoryName: string;
    // public regulatoryRegistrationNo: string;
    // public regulatoryRegistrationDate: string;
    // public regulatoryIsRenewalRequired: string;
    // public regulatoryRenewalDate: string;
    // public regulatoryUrl: string;

    public schedulerFrequencyMaster: string;
    public scheduledDates: Array<string>;

  constructor(model: any = {}){
    super();
    const {
      id, name,
      taskId, orgTaskScheduleId,
        complianceTypeId, regulatoryId,
        taxRegimeId, subscriptionId, taxRebateRate, isExemptedForTaxation, calculationType, rate,
        empExecutiveId,
        taskName, complianceTypeName, taxRegimeName, subscriptionName, empExecutiveName,
        regulatoryName,
        schedulerFrequencyMaster, scheduledDates
  } = model;
    this.id = id;
    this.name = name;

    this.complianceTypeId = complianceTypeId;
    this.regulatoryId = regulatoryId;
    this.taxRegimeId = taxRegimeId;
    this.subscriptionId = subscriptionId;
    this.taxRebateRate = taxRebateRate;
    this.isExemptedForTaxation = isExemptedForTaxation;

    this.taskId = taskId;
    this.orgTaskScheduleId = orgTaskScheduleId;

    this.empExecutiveId = empExecutiveId;


    this.taskName = taskName;
    this.complianceTypeName = complianceTypeName;
    this.taxRegimeName = taxRegimeName;
    this.subscriptionName = subscriptionName;
    this.empExecutiveName = empExecutiveName;
    this.regulatoryName = regulatoryName;
    // this.regulatoryRegistrationNo = regulatoryRegistrationNo;
    // this.regulatoryRegistrationDate = regulatoryRegistrationDate;
    // this.regulatoryIsRenewalRequired = regulatoryIsRenewalRequired;
    // this.regulatoryRenewalDate = regulatoryRenewalDate;
    // this.regulatoryUrl = regulatoryUrl;
      this.schedulerFrequencyMaster = schedulerFrequencyMaster;
      this.scheduledDates = (scheduledDates || []).map(r => r);
  }
}

export class ComplianceSerializer {
  fromJson(json: any): Compliance { return new Compliance(json); }

  toJson(data: any): any {
    return data;
  }
}
