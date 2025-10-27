export class Branch {
  public id: string;
  public address: string;
  public branchCode: string;

  public contactName: string;
  public contactNo1: string;
  public contactNo2: string;
  public emailId1: string;
  public emailId2: string;
  public branchOrgId: string;
  public countryId: string;
  public establishedDate: string;
  public isHeadBranch: boolean;
  public isSelfAdministration: boolean;
  public name: string;
  public orgUnitId: string;

  constructor(model: any = {}){
    this.id = model.id;
    this.address = model.address;
    this.branchCode = model.branchCode;
    this.branchOrgId = model.branchOrgId;
    this.countryId = model.countryId;
    this.contactName = model.contactName;
    this.contactNo1 = model.contactNo1;
    this.contactNo2 = model.contactNo2;
    this.emailId1 = model.emailId1;
    this.emailId2 = model.emailId2;
    this.establishedDate = model.establishedDate;
    this.isHeadBranch = model.isHeadBranch;
    this.isSelfAdministration = model.isSelfAdministration;
    this.name = model.name;
    this.orgUnitId = model.orgUnitId;
  }
}

export class BranchSerializer {
  fromJson(json: any): Branch {
    return new Branch(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name,
      //businessId: data.businessId,
      address: data.address,
      contactName : data.contactName,
      contactNo1 : data.contactNo1,
      contactNo2 : data.contactNo2,
      emailId1 : data.emailId1,
      emailId2 : data.emailId2,
      establishedDate: data.establishedDate,
      isHeadBranch: data.isHeadBranch,
      isSelfAdministration: data.isSelfAdministration,
      affiliatedName: data.affiliatedName,
      operatedById: data.operatedById,
      hostName: data.hostName
    };
  }
}
