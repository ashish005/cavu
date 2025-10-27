export class OrgUserGroupCategory {
  public id: string;
  public userType: string;
  public name: string;
  public masterType: string;
  public status: string;

  constructor(model: any = {}){
    this.id = model.id;
    this.userType = model.userType;
    this.name = model.name;
    this.masterType = model.masterType;
    this.status = model.status;
  }
}

export class OrgUserGroupCategorySerializer {
  fromJson(json: any): OrgUserGroupCategory {
    return new OrgUserGroupCategory(json);
  }

  toJson(data: any): any {
    return {};
  }
}
