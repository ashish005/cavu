import {CoreQueryOptions} from "@app-global";

export class BusinessQueryOptions extends CoreQueryOptions {
    countryId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            countryId: this.countryId
        };
        return this.getParamByObject(obj);
    }
}

export class Business {
  id: string;
  orgUnitId: string;
  name: string;
  countryId: number;
  softwareId: string;
  businessTypeId: string;
  countryName: string;
  businessTypeName: string;
  softwareName: string;
  sectorName: string;
  activeLicenseCount: number;
  enabledModuleCount: string;
  userCount: number;

  isActive: boolean;
  constructor(model: any = <any>{}){
    const {
        id, name, orgUnitId, countryId, softwareId, businessTypeId,
        countryName, businessTypeName, softwareName, sectorName,
        activeLicenseCount, enabledModuleCount, userCount
    } = model;
    this.id = id;
    this.name = name;
    this.orgUnitId = orgUnitId;

    this.countryId = countryId;
    this.softwareId = softwareId;
    this.businessTypeId = businessTypeId;

    this.countryName = countryName;
    this.softwareName = softwareName;
    this.sectorName = sectorName;
    this.businessTypeName = businessTypeName;
    this.activeLicenseCount = activeLicenseCount;
    this.enabledModuleCount = enabledModuleCount;
    this.userCount = userCount;
  }
}

export class BusinessSerializer {
  fromJson(json: any): Business {
    return new Business(json);
  }

  toJson(data: any): any {
    return data;
  }
}
