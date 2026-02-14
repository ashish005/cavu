import {CoreResource} from "@app-global";

export class LogLookup extends CoreResource{
  //id: number | string;

  constructor(model: any = <any>{}){
    super();
  }
}

export class  LogLookupSerializer {
  fromJson(json: any): LogLookup {
    return new LogLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
