export class BusinessHostConfig {
  id: string;
  name: string;
  connectionName: string;
  connectionString: string;
  connectionType: string;
  isUnderConstruction: boolean;
  enable: boolean;
  hostName: string;
  tenantPoint: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.name = model.name;
    this.connectionName = model.connectionName;
    this.connectionString =  model.connectionString;
    this.connectionType = model.connectionType;
    this.isUnderConstruction = model.isUnderConstruction;
    this.enable = model.enable;
    this.hostName = model.hostName;
    this.tenantPoint = model.tenantPoint;
  }
}

export class BusinessHostConfigSerializer {
  fromJson(json: any): BusinessHostConfig {
    return new BusinessHostConfig(json);
  }

  toJson(data: BusinessHostConfig): any {
    return {
      id: data.id,
      name: data.name,
      dBConnectionName: data.connectionName,
      dBConnectionType: data.connectionType,
      isUnderConstruction: data.isUnderConstruction,
      enable: data.enable,
      hostName: data.hostName
    };
  }
}
