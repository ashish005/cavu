import {CoreQueryOptions} from "@app-global";

export class LeaveGroupQueryOptions extends CoreQueryOptions{}

export class LeaveGroup {
  id: string;
  name: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
  }
}

export class LeaveGroupSerializer {
  fromJson(json: any): LeaveGroup {
    return new LeaveGroup(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name,
    };
  }
}
