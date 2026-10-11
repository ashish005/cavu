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
  isDemoSeedApplied: string;
  isMasterSeedApplied: string;

  isActive: boolean;
  constructor(model: any = <any>{}){
    const {
        id, orgUnitId, name, address, websiteUrl, isDemoSeedApplied, isMasterSeedApplied, isActive
    } = model;
    this.id = id;
    this.orgUnitId = orgUnitId;
    this.name = name;
    this.address = address;
    this.websiteUrl = websiteUrl;
    this.isDemoSeedApplied = isDemoSeedApplied;

    this.isMasterSeedApplied = isMasterSeedApplied;
    this.isActive = isActive;
  }
}

export class OrgBranchSerializer {
  fromJson(json: any): OrgBranch { return new OrgBranch(json); }
  toJson(data: any): any { return data; }
}
