import {CoreQueryOptions} from "@app-global";

export class BatchQueryOptions extends CoreQueryOptions{
    sessionId: string;

    override toQueryString(){
        const obj = {
            sessionId: this.sessionId
        };
        return super.getParamByObject(obj);
    }
}

export class Batch {
  id: string;
  name: string;
  startDate: string;
  orgSessionId: number;
  orgSessionName: string;
  studyModeTypeId: string;
  studyModeTypeName: string;

  isLocked: boolean;
  status: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.startDate = model.startDate;//.toRegionDate();
    this.orgSessionId = model.orgSessionId;
    this.orgSessionName = model.orgSessionName;
    this.studyModeTypeId = model.studyModeTypeId;
    this.studyModeTypeName = model.studyModeTypeName;

    this.isLocked = model.isLocked;
    this.status = model.status;
  }
}

export class BatchSerializer {
  fromJson(json: any): Batch {
    return new Batch(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name,
      startDate: data.startDate,
      orgSessionId: data.orgSessionId,
      studyModeTypeId: data.studyModeTypeId
    };
  }
}
