export class  DashboardSupportTicketSummary {
  id: string;

  portletId: number;
  parentOrg: string;
  orgUnitId: string;
  branchId: string;
  name: string;
  total: number;
  opened: number;
  closed: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.portletId = model.portletId;
    this.parentOrg = model.parentOrg;
    this.orgUnitId = model.orgUnitId;
    this.branchId = model.branchId;
    this.name = model.name;
    this.total = model.total;
    this.opened = model.opened;
    this.opened = model.closed;
  }
}

export class  DashboardSupportTicketSummarySerializer {
  fromJson(json: any): DashboardSupportTicketSummary {
    return new DashboardSupportTicketSummary(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
