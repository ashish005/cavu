export class ModulePermission {
    public id: string;
    public code: string;
    public name: string;
    public parentId: number | string;
    public status: string;
    public children: Array<ModulePermission>;

    constructor(model: any = {}){
        this.id = model.id;
        this.code = model.code;
        this.name = model.name;
        this.parentId = model.parentId;
        this.status = model.status;
        this.children = (model.children || []).map(r => new ModulePermission(r));
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
