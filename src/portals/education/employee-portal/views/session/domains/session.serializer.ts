import {CoreQueryOptions} from "@app-global";

export class OrgSessionQueryOptions extends CoreQueryOptions{}

export class OrgSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalBatch: number;

  isLocked: boolean;
  status: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.startDate = model.startDate;
    this.endDate = model.endDate;

    this.totalBatch = model.totalBatch;
    this.isLocked = model.isLocked;
    this.status = model.status;
  }
}

export class OrgSessionSerializer {
  fromJson(json: any): OrgSession {
    return new OrgSession(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name,
      //orgUnitIds: data.orgUnitIds,
      startDate: data.startDate,
      endDate: data.endDate
    };
  }
}
