import { CoreQueryOptions } from "@app-global";

export class ModulePermissionQueryOptions extends CoreQueryOptions {
    orgUnitId!: string;
    orgSector!: string;
    softwareCode!: string;
    licenseType!: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
          orgUnitId: this.orgUnitId,
          orgSector: this.orgSector,
          softwareCode: this.softwareCode,
          licenseType: this.licenseType
        };
        return this.getParamByObject(obj);
    }
}

export class ModulePermission {
    public id: string;
    public code: string;
    public name: string;
    public description: string;
    public parentId: number | string;
    public status: string;
    public isActive: boolean;
    public children: Array<ModulePermission>;

    constructor(model: any = {}){
        this.id = model.id;
        this.code = model.code;
        this.name = model.name;
        this.description = model.description;
        this.parentId = model.parentId;
        this.status = model.status;
        this.isActive = model.isActive;
        this.children = (model.children || []).map((r: any) => new ModulePermission(r));
    }
}

export class ModulePermissionSerializer {
  fromJson(json: any): ModulePermission {
    return new ModulePermission(json);
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
