import {CoreQueryOptions} from "@app-global";

export class BranchQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}

export class Branch {
  public id: string;
  public address: string;
  public branchCode: string;
  public websiteUrl: string;

  public contactName: string;
  public contactNo1: string;
  public contactNo2: string;
  public emailId1: string;
  public emailId2: string;
  public countryId: string;
  public country: string;
  public establishedDate: string;
  public isHeadBranch: boolean;
  public isSelfAdministration: boolean;
  public name: string;
  public isActive: boolean;

  constructor(model: any = {}){
    this.id = model.id;
    this.address = model.address;
    this.branchCode = model.branchCode;
    this.websiteUrl = model.websiteUrl;
    this.countryId = model.countryId;
    this.country = model.country;
    this.contactName = model.contactName;
    this.contactNo1 = model.contactNo1;
    this.contactNo2 = model.contactNo2;
    this.emailId1 = model.emailId1;
    this.emailId2 = model.emailId2;
    this.establishedDate = model.establishedDate;
    this.isHeadBranch = model.isHeadBranch;
    this.isSelfAdministration = model.isSelfAdministration;
    this.name = model.name;
    this.isActive = model.isActive;
  }
}

export class BranchSerializer {
  fromJson(json: any): Branch {
    return new Branch(json);
  }

  toJson(data: any): any { return data; }
}
