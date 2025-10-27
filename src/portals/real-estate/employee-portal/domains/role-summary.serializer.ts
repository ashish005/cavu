export class  DashboardRoleSummary {
  id: string;
  portletId: number;
  parentOrg: string;
  orgUnitId: string;
  branchId: string;
  name: string;
  totalEmployee: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.portletId = model.portletId;
    this.parentOrg = model.parentOrg;
    this.orgUnitId = model.orgUnitId;
    this.branchId = model.branchId;
    this.name = model.name;
    this.totalEmployee = model.totalEmployee;
  }
}

export class  DashboardRoleSummarySerializer {
  fromJson(json: any): DashboardRoleSummary {
    return new DashboardRoleSummary(json);
  }

  toJson(data: any): any {
    return {};
  }
}
