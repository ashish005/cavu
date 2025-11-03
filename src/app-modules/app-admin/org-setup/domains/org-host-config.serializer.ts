import {CoreQueryOptions} from "@app-global";
export class OrgHostConfigQueryOptions extends CoreQueryOptions {
    tenantId: number;
    constructor(model: any = <any>{}){ super(); }

    override toQueryString (){
        const obj = {
            tenantId: this.tenantId
        };
        return super.getParamByObject(obj);
    }
}
export class OrgHostConfig {
  id: number;
  tenantId: number;
  // connectionName: string;
  // connectionType: string;
  // connectionString: string;
  isUnderConstruction: boolean;
  enable: boolean;
  hostName: string;
  tenantPoint: string;
  createdDate: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.tenantId = model.tenantId;
    // this.connectionName = model.dB_ConnectionName;
    // this.connectionType = model.dB_ConnectionType;
    // this.connectionString = model.connectionString;
    this.isUnderConstruction = model.isUnderConstruction;
    this.enable = model.enable;
    this.hostName = model.hostName;
    this.tenantPoint = model.tenantPoint;
    this.createdDate = model.createdDate;
  }
}

export class OrgHostConfigSerializer {
    fromJson(json: any): OrgHostConfig { return new OrgHostConfig(json); }
    toJson(data: any): any { return data; }
}