export class DashboardOrgSummary {
  id: string;
  portletId: number;
  parentOrg: string;
  orgUnitId: string;
  branchId: string;
  organization: string;
  orgCode: string;
  address: string;
  contactname: string;
  contactNo1: string;
  contactNo2: string;
  contactEmail1: string;
  totalStudent: number;
  totalEmployee: number;
  totalCourse: number;
  supportTicket: number;
  totalFee: number;
  totalPaid: number;
  isHeadBranch: boolean;

  constructor(model: any = <any>{}) {
    const {
      portletId, parentOrg, orgUnitId, branchId, organization, orgCode, address, contactname, contactNo1, contactNo2, contactEmail1,
      totalStudent, totalEmployee, totalCourse, supportTicket, totalFee, totalPaid, isHeadBranch
    } = model;


    this.portletId = portletId;
    this.parentOrg = parentOrg;
    this.orgUnitId = orgUnitId;
    this.branchId = branchId;
    this.organization = organization;
    this.orgCode = orgCode;
    this.address = address;
    this.contactname = contactname;
    this.contactNo1 = contactNo1;
    this.contactNo2 = contactNo2;
    this.contactEmail1 = contactEmail1;
    this.totalStudent = totalStudent;
    this.totalEmployee = totalEmployee;
    this.totalCourse = totalCourse;
    this.supportTicket = supportTicket;
    this.totalFee = totalFee;
    this.totalPaid = totalPaid;
    this.isHeadBranch = isHeadBranch;
  }
}

export class DashboardOrgSummarySerializer {
  fromJson(json: any): DashboardOrgSummary {
    return new DashboardOrgSummary(json);
  }

  toJson(data: any): any {
    return {};
  }
}
