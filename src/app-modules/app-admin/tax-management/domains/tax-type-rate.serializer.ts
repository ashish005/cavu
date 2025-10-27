import {CoreQueryOptions} from "@app-global";
class MasterType {
  isLocked: boolean;
  status: string;
  isDeleted: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;

  constructor(model: any = <any>{}){
    this.isLocked = model.isLocked;
    this.status = model.status;
    this.isDeleted = model.isDeleted;
    this.createdBy = model.createdBy;
    this.createdDate = new Date(model.createdDate).toDateString();
    this.modifiedBy = model.modifiedBy;
    this.modifiedDate = model.modifiedDate? new Date(model.modifiedDate).toDateString(): null;
  }
}

export class TaxTypeRateQueryOptions extends CoreQueryOptions{
    taxGroupId: string;
    constructor(model: any = {}){ super(model);}

    toQueryString (){
        const obj = { taxGroupId: this.taxGroupId };
        return super.getParamByObject(obj);
    }
}

export class TaxTypeRate extends MasterType {
  id: string;
  name: string;
  rate: number;
  // accountId: string;
  // supplyTypeId: number;
  taxGroupId: number;
  //transactionTypeId: number;
  parentId: number;
  // Used just to show
  //account: string;
  supplyType: string;
  taxGroup: number;
  //transactionType: number;
  extraTaxRate: number;
  hasExtraTaxRate: boolean;
  children: Array<TaxTypeRate>;

  constructor(model: any = <any>{}){
    super(model);
    const { id, name, rate, taxGroupId, supplyType, taxGroup, children, extraTaxRate, hasExtraTaxRate } = model;
    this.id = id;
    this.name = name;
    this.rate = rate;
    this.taxGroupId = taxGroupId;
    // this.accountId = accountId;
    // this.supplyTypeId = supplyTypeId;
    //
    // this.transactionTypeId = transactionTypeId;
    // this.parentId = parentId || null;
    // this.account = account;
    this.supplyType = supplyType;
    this.taxGroup = taxGroup;
    this.extraTaxRate = extraTaxRate || 0;
    this.hasExtraTaxRate = hasExtraTaxRate;
    this.children =  (children || []).map(r => new TaxTypeRate(r))
  }
}

export class TaxTypeRateSerializer {
  fromJson(json: any): TaxTypeRate {
    return new TaxTypeRate(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
