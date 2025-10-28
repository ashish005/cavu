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

export class TaxCategoryQueryOptions extends CoreQueryOptions{
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

export class TaxTypeRateMapper {
  id: any;
  name: string;
  rate: number;
  extraTaxRate: number;
  hasExtraTaxRate: boolean;
  status: boolean;
  taxMapperId: any;
  parentId: number;
  children: Array<TaxTypeRateMapper>;

  constructor(model: any = <any>{}){
    const { id, name, rate, extraTaxRate, hasExtraTaxRate, taxMapperId, status, parentId, children } = model;
    this.id = id;
    this.name = name;
    this.rate = rate;
    this.extraTaxRate = extraTaxRate;
    this.hasExtraTaxRate = hasExtraTaxRate;
    this.rate = rate;
    this.status = status;
    this.taxMapperId = taxMapperId;
    this.parentId = parentId || null;
    this.children = (children || []).map(r => new TaxTypeRateMapper(r));
  }
}

export class TaxCategory extends MasterType {
  id: string;
  name: string;
  taxCode: string;
  isService: boolean;
  taxGroupId: number;
  taxGroup: string;
  taxTypeRateMapper: Array<TaxTypeRateMapper>;

  constructor(model: any = <any>{}){
    super(model);

    const { id, name, taxCode, isService, taxGroupId, taxGroup, taxTypeRateMapper } = model;

    this.id = id;
    this.name = name;
    this.taxCode = taxCode;
    this.isService = isService;
    this.taxGroupId = taxGroupId;
    this.taxGroup = taxGroup;
    this.taxTypeRateMapper = (taxTypeRateMapper || []).map(r => new TaxTypeRateMapper(r));
  }
}

export class TaxCategorySerializer {
  fromJson(json: any): TaxCategory {
    return new TaxCategory(json);
  }

  toJson(data: any): any {
    const { id, name, taxCode, isService, taxGroupId, rateMapperRule } = data;
    return {
      id: id,
      name: name,
      taxCode: taxCode,
      isService: isService,
      taxGroupId: taxGroupId,
      taxMapper: rateMapperRule.map(r => {
          r.status = (r.status)? 1: 2
          return r;
      })
    };
  }
}
