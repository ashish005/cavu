export class DashboardPaymentSummary {
  id: string;
  portletId: number;
  parentOrg: string;
  orgUnitId: string;
  branchId: string;
  paymentMode: string;
  totalPaid: string;
  constructor(model: any = <any>{}){
    this.id = model.id;
    this.portletId = model.portletId;
    this.parentOrg = model.parentOrg;
    this.orgUnitId = model.orgUnitId;
    this.branchId = model.branchId;
    this.paymentMode = model.paymentMode;
    this.totalPaid = model.totalPaid;
  }
}

export class DashboardPaymentSummarySerializer {
  fromJson(json: any): DashboardPaymentSummary {
    return new DashboardPaymentSummary(json);
  }

  toJson(data: any): any {
    return {};
  }
}
