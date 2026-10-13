import {CoreQueryOptions} from "@app-global";

export class OrgBranchQueryOptions extends CoreQueryOptions {
    orgUnitId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            orgUnitId: this.orgUnitId
        };
        return this.getParamByObject(obj);
    }
}

export class OrgBranch {
  id: string;
  orgUnitId: string;
  name: string;
  address: string;
  websiteUrl: string;
    applyDemoSeed: boolean;
    applyMasterSeed: boolean;

  isActive: boolean;
  constructor(model: any = <any>{}){
    const {
        id, orgUnitId, name, address, websiteUrl, applyDemoSeed, applyMasterSeed, isActive
    } = model;
    this.id = id;
    this.orgUnitId = orgUnitId;
    this.name = name;
    this.address = address;
    this.websiteUrl = websiteUrl;

    this.applyDemoSeed = applyDemoSeed;
    this.applyMasterSeed = applyMasterSeed;
    this.isActive = isActive;
  }
}

export class OrgBranchSerializer {
  fromJson(json: any): OrgBranch { return new OrgBranch(json); }
  toJson(data: any): any { return data; }
}
