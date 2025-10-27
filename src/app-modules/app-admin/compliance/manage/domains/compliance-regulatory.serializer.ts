import {CoreQueryOptions, CoreResource} from "@app-global";

export class ComplianceRegulatoryQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}

export class ComplianceRegulatory extends CoreResource {
    public id: number;
    public name: string;
    public registrationNo: string;
    public registrationDate: string;
    public isRenewalRequired: boolean;
    public renewalDate: string;
    public url: number;
    public userId: number;
    public password: string;
    public status: string;

  constructor(model: any = {}){
    super();
    const {id, name,
        registrationNo, registrationDate,
        isRenewalRequired, renewalDate,
        url, userId, password, status
    } = model;
    this.id = id;
    this.name = name;
    this.registrationNo = registrationNo;
    this.registrationDate = registrationDate;
    this.isRenewalRequired = isRenewalRequired;
    this.renewalDate = renewalDate;
    this.url = url;
    this.userId = userId;
    this.password = password;
    this.status = status;
  }
}

export class ComplianceRegulatorySerializer {
  fromJson(json: any): ComplianceRegulatory { return new ComplianceRegulatory(json); }
  toJson(data: any): any { return data; }
}
