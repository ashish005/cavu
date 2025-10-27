import {CoreQueryOptions, CoreResource} from "@app-global";

export class LeaveTypeQueryOptions extends CoreQueryOptions{}

export class LeaveType extends CoreResource{
  override id: string;
  name: string;
  carryForwardAllowedToNextFinYear: boolean;
  carryForwardAllowedToNextMonth: boolean;
  deductionRateWithoutApproval: boolean;
  isApprovalRequired: boolean;
  isCarryForwardToNextFinYear: boolean;
  isCarryForwardToNextMonth: boolean;
  isDeleted: boolean;
  isLocked: boolean;
  leaveCode: string;
  leaveCount: number;
  maxLeaveCountInFinYear: number;
  maxLeaveCountInOneTime: number;
  minIntimationDays: number;

  constructor(model: any = <any>{}) {
    super();
    this.id = model.id;
    this.name = model.name;
    this.carryForwardAllowedToNextFinYear = model.carryForwardAllowedToNextFinYear;
    this.carryForwardAllowedToNextMonth = model.carryForwardAllowedToNextMonth;
    this.deductionRateWithoutApproval = model.deductionRateWithoutApproval;
    this.isApprovalRequired = model.isApprovalRequired;
    this.isCarryForwardToNextFinYear = model.isCarryForwardToNextFinYear;
    this.isCarryForwardToNextMonth = model.isCarryForwardToNextMonth;
    this.isDeleted = model.isDeleted;
    this.isLocked = model.isLocked;
    this.leaveCode = model.leaveCode;
    this.leaveCount = model.leaveCount;
    this.maxLeaveCountInFinYear = model.maxLeaveCountInFinYear;
    this.maxLeaveCountInOneTime = model.maxLeaveCountInOneTime;
    this.minIntimationDays = model.minIntimationDays;
  }
}

export class LeaveTypeSerializer {
  fromJson(json: any): LeaveType {
    return new LeaveType(json);
  }

  toJson(info: any): any {
    const data = {
      name: info.name
    };
    return data;
  }
}
