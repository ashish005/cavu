import {CoreQueryOptions} from "@app-global";

export class DataLogQueryOptions extends CoreQueryOptions{
  constructor(model: any = {}){
    super(model);
  }
  override toQueryString (){
    const obj = {};
    return super.getParamByObject(obj);
  }
}

export class DataLog {
  id: string;
  storeFromId: number;
  storeToId: number;
  isExport: boolean;
  isImport: boolean;
  fromDate: string;
  toDate: string;
  reportName: string;

  constructor(model: any = <any>{}){
    const { id, storeFromId, storeToId, isExport, isImport, fromDate, toDate, reportName } = model;
    this.id = id;
    this.storeFromId = storeFromId;
    this.storeToId = storeToId;
    this.isExport = isExport;
    this.isImport = isImport;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.reportName = reportName;
  }
}

export class DataLogSerializer {
  fromJson(json: any): DataLog {
    return new DataLog(json);
  }

  toJson(data: any): any {
    return {};
  }
}
