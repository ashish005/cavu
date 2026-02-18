import {CoreQueryOptions} from "@app-global";

export class TaxManagementQueryOptions extends CoreQueryOptions{
    taxGroupId: string;
    constructor(model: any = {}){
        super(model);
        this.taxGroupId = model.taxGroupId || '';
    }

    override toQueryString (){
        const obj = { taxGroupId: this.taxGroupId };
        return super.getParamByObject(obj);
    }
}

export class TaxManagement {
  id: number;
  categoryId: number;
  taxTypeRateId: number;
  taxCode: string;
  name: string;
  rate: number;
  categoryName: string;
  extraTaxRate: number;
  hasExtraTaxRate: boolean;

  status: boolean;
  isLocked: boolean;

  constructor(model: any = <any>{}){
    const { id, categoryId, taxTypeRateId, taxCode, name, rate, extraTaxRate, hasExtraTaxRate, categoryName, status, isLocked } = model;
    this.id = id;
    this.categoryId = categoryId;
    this.taxTypeRateId = taxTypeRateId;
    this.taxCode = taxCode;
    this.name = name;
    this.rate = rate;
    this.extraTaxRate = extraTaxRate;
    this.hasExtraTaxRate = hasExtraTaxRate;
    this.rate = rate;
    this.status = status;
    this.isLocked = isLocked;
    this.categoryName = categoryName;
  }
}

export class TaxManagementSerializer {
  fromJson(json: any): TaxManagement { return new TaxManagement(json); }

  toJson(data: any): any {
    return data;
  }
}
