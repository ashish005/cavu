import {CoreResource} from "@app-global";

export class TaxGroupLookup {
    id: string;
    name: string;
    masterType: string;
    constructor(model: any = <any>{}){
        const { id, name, masterType} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
    }
}
export class TaxTypeLookup {
  id: any;
  name: string;
  rate: number;
  accountId: string;
  parentId: number;
  taxGroupId: number;
  extraTaxRate: number;
  hasExtraTaxRate: boolean;
  taxGroup: string;

  constructor(model: any = <any>{}){
    const { id, name, rate, accountId, taxGroupId, parentId, extraTaxRate, hasExtraTaxRate, taxGroup } = model;
    this.id = id;
    this.name = name;
    this.rate = rate;
    this.taxGroupId = taxGroupId;
    this.accountId = accountId;
    this.parentId = parentId;
    this.extraTaxRate = extraTaxRate;
    this.hasExtraTaxRate = hasExtraTaxRate;
    this.taxGroup = taxGroup;
  }
}

export class LookupTaxCategory extends CoreResource{
  taxTypes: Array<TaxTypeLookup>;
  taxGroups: Array<TaxGroupLookup>;
  constructor(model: any = <any>{}){
    super();
    const { taxTypes, taxGroups } = model;
    this.taxTypes = (taxTypes || []).map(r => new TaxTypeLookup(r));
    this.taxGroups = (taxGroups || []).map(r => new TaxGroupLookup(r));
  }
}

export class LookupTaxCategorySerializer {
  fromJson(json: any): LookupTaxCategory {
    return new LookupTaxCategory(json);
  }

  toJson(data: any): any {
    return {};
  }
}
