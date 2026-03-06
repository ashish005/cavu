import {CoreResource} from "@app-global";

class StudyModeType  {
  id: string;
  name: string;
  parentId: number;
  isDefault: boolean;
  sortOrder: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.parentId = model.parentId;
    this.isDefault = model.isDefault;
    this.sortOrder = model.sortOrder;
  }
}


export class SessionLookup extends CoreResource {
  //orgSession: Array<OrgSession> = [];
  studyMode: Array<StudyModeType> = [];

  constructor(model: any = <any>{}){
    super();
    //this.orgSession = model.orgSession;
    this.studyMode = model.studyMode;
  }

  /*addToOrgSession(session: OrgSession){
    const infoIndex = (this.orgSession || []).map(r=> r.id).indexOf(session.id);

    if(infoIndex > -1){
      this.orgSession[infoIndex] = session;
    } else {
      (this.orgSession || []).push(session);
    }
  }

  getOrgSessionById(orgSessionId: string){
    return (this.orgSession || []).find((r)=> r.id == orgSessionId);
  }*/

  getStudyModeById(studyModeId: string){
    return (this.studyMode || []).find((r)=> r.id == studyModeId);
  }
}

export class SessionLookupSerializer {
  fromJson(json: any): SessionLookup {
    return new SessionLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
