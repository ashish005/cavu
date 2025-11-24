import {CalculationTypeLookup, CoreQueryOptions, CoreResource, OrgTaskConfigLookup, TaxRegimeLookup} from "@app-global";
export class ComplianceQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}
class SubscriptionsLookup
{
    id: any;
    name: string;
    constructor(model: any = {}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ComplianceTypeLookup
{
  id: any;
  name: string;
  masterType: string;
  subscriptions: Array<any>;
  constructor(model: any = {}){
    const { id, name, masterType, subscriptions } = model;
    this.id = id;
    this.name = name;
    this.masterType = masterType;
    this.subscriptions = (subscriptions || []).map(r => new SubscriptionsLookup(r));
  }
}
export class RegulatoryLookup
{
    id: any;
    name: string;
    constructor(model: any = {}){
        const { id, name, subscriptions } = model;
        this.id = id;
        this.name = name;
    }
}

export class ComplianceLookup  extends CoreResource {
  complianceTypes: Array<ComplianceTypeLookup>;
  regulatories: Array<RegulatoryLookup>;
  calculationTypes: Array<any>;
  orgTaskConfigs: Array<any>;
  taxRegimes: Array<any>;
  constructor(model: any = {}){
    super();
    const { complianceTypes, regulatories, calculationTypes, taxRegimes, orgTaskConfigs } = model;
    this.complianceTypes = (complianceTypes || []).map(r => new ComplianceTypeLookup(r));
    this.regulatories = (regulatories || []).map(r => new RegulatoryLookup(r));
    this.calculationTypes = (calculationTypes || []).map(r => new CalculationTypeLookup(r));
    this.taxRegimes = (taxRegimes || []).map(r => new TaxRegimeLookup(r));
    this.orgTaskConfigs = (orgTaskConfigs || []).map(r => new OrgTaskConfigLookup(r));
  }

  getSubscriptionsByComplianceType=(complianceTypeId) => (this.complianceTypes || []).find(r => r.id == complianceTypeId)?.subscriptions || [];
}

export class ComplianceLookupSerializer {
  fromJson(json: any): ComplianceLookup { return new ComplianceLookup(json); }

  toJson(data: any): any {
    return data;
  }
}
