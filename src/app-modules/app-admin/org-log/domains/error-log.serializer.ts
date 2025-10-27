import {CoreQueryOptions} from "@app-global";

export class ErrorLogQueryOptions extends CoreQueryOptions{
  constructor(model: any = {}){
    super(model);
  }
  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

export class ErrorLog {
  id: string;
  effectedId: string;
  errorMessage: string;
  errorNo: string;
  info: string;
  isOrgSpecificError: boolean;
  xMlValue: any;
  createdBy: string;
  createdDate: string;

  constructor(model: any = <any>{}){
    const { id, effectedId, errorMessage, errorNo, info, isOrgSpecificError, xMlValue, createdBy, createdDate } = model;
    this.id = id;
    this.effectedId = effectedId;
    this.errorMessage = errorMessage;
    this.errorNo = errorNo;
    this.info = info;
    this.isOrgSpecificError = isOrgSpecificError;
    this.xMlValue = xMlValue;
    this.createdBy = createdBy;
    this.createdDate = createdDate;
  }
}

export class ErrorLogSerializer {
  fromJson(json: any): ErrorLog {
    return new ErrorLog(json);
  }

  toJson(data: any): any {
    return {};
  }
}
