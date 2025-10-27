import {CoreResource} from "@app-global";

export class LookupVoucherConfig {
    id: number;
    voucherNoType: string;
    voucherNoTypeId: number;
    voucherNoLength: number;
    voucherNoStartingFrom: number;
    validFrom: string;
    prefix: string;
    isDefault: boolean;
    startWithPrefix: boolean;
    startWithZero: boolean;
    suffix: number;

    constructor(model: any = <any>{}){
        const {
            id, voucherNoType, voucherNoTypeId,
            voucherNoLength, voucherNoStartingFrom,
            validFrom, prefix,
            startWithPrefix, startWithZero, suffix
        }  = model || {};
        this.id = id;
        this.voucherNoType = voucherNoType;
        this.voucherNoTypeId = voucherNoTypeId;
        this.voucherNoLength = voucherNoLength;
        this.voucherNoStartingFrom = voucherNoStartingFrom;
        this.validFrom = validFrom;
        this.prefix = prefix;
        this.startWithPrefix = startWithPrefix;
        this.startWithZero = startWithZero;
        this.suffix = suffix;
    }
}
export class LookupVoucherType {
    id: number;
    name: string;
    masterType: string;
    abbreviation: string;
    configId: number;
    isPrimary: boolean;
    primaryEntity: string;
    voucherNoDisplay: string;
    voucherDateDisplay: string;
    sortOrder: number;
    isDefault: boolean;
    totalVoucherCount: number;
    config: LookupVoucherConfig;

    isTaxInclude: boolean;

    constructor(model: any = <any>{}){
        const {
            id, name, masterType, abbreviation,
            configId, config,
            isPrimary, primaryEntity, voucherNoDisplay, voucherDateDisplay,
            sortOrder, isDefault, totalVoucherCount,
            isTaxInclude
        }  = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.abbreviation = abbreviation;
        this.configId = configId;
        this.isPrimary = isPrimary;
        this.primaryEntity = primaryEntity;
        this.voucherNoDisplay = voucherNoDisplay;
        this.voucherDateDisplay = voucherDateDisplay;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
        this.totalVoucherCount = totalVoucherCount;
        this.config = new LookupVoucherConfig(config);
        this.isTaxInclude = isTaxInclude;
    }
}

export class OrgInvoiceLookup extends CoreResource{
  voucherTypes: Array<LookupVoucherType>;

  constructor(model: any = <any>{}){
    super();
    const { voucherTypes } = model;
    this.voucherTypes = (voucherTypes || []).map((r)=> new LookupVoucherType(r));
  }

  getVoucherTypeById(voucherTypeId: number)
  {
    return (this.voucherTypes || []).find(r => r.id == voucherTypeId);
  }
}

export class OrgInvoiceLookupSerializer {
  fromJson(json: any): OrgInvoiceLookup {
    return new OrgInvoiceLookup(json);
  }

  toJson(data: any): any {
    return {};
  }
}
