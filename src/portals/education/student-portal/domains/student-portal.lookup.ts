//import {OrgTheme} from "@app-core";

export class StudentPortalLookup {
  id: string;
  //activeTheme: OrgTheme;
  constructor(model: any = <any>{}){
    const { id, org } = model;
    this.id = id;
    //this.activeTheme = new OrgTheme(org.theme);
  }
}

export class  StudentPortalLookupSerializer {
  fromJson(json: any): StudentPortalLookup {
    return new StudentPortalLookup(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
