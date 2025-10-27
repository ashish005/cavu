import {CoreQueryOptions} from "@app-global";

export class OrgLicenseHistoryQueryOptions extends CoreQueryOptions{}

export class OrgLicenseHistory {
  id: string;
  licenseId: number;
  licenseNo: string;
  licenseTypeId: string;
  softwareId: string;
  remark: string;
  apiKeyId: number;

  apiKeyName: string;
  licenseTypeName: string;
  softwareName: string;
  softwareDescription: string;
  status: string;

  validFrom: number;
  isValidLicense: boolean;
  validityInDays: number;

  constructor(model: any = <any>{}){
    const {
      id, licenseId, licenseNo, licenseTypeId, softwareId, remark, status,
        apiKeyName, apiKeyId, licenseTypeName, softwareName, softwareDescription,
        validFrom, isValidLicense, validityInDays
    } = model;
    this.id = id;
    this.licenseId = licenseId;
    this.licenseNo = licenseNo;
    this.licenseTypeId = licenseTypeId;
    this.softwareId = softwareId;
    this.apiKeyId = apiKeyId;
    this.remark = remark;
    this.status = status;

    this.apiKeyName = apiKeyName;
    this.licenseTypeName = licenseTypeName;
    this.softwareName = softwareName;
    this.softwareDescription = softwareDescription;

    this.validFrom = validFrom;
    this.isValidLicense = isValidLicense;
    this.validityInDays = validityInDays;
  }
}

export class OrgLicenseHistorySerializer {
  fromJson(json: any): OrgLicenseHistory { return new OrgLicenseHistory(json); }

  toJson(data: any): any {
    return data;
  }
}
