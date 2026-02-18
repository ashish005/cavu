import { CoreResource } from "@app-global";

export class LookupTrxnAllocationTypes {
    id: string;
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
    //config: LookupVoucherConfig;

    constructor(model: any = <any>{}){
        const {
            id, name, masterType, abbreviation,
            configId, config,
            isPrimary, primaryEntity, voucherNoDisplay, voucherDateDisplay,
            sortOrder, isDefault, totalVoucherCount
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
        //this.config = new LookupVoucherConfig(config);
    }
}

export class LookupTrxnTypes {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        const { id, name}  = model;
        this.id = id;
        this.name = name;
    }
}

export class LookupBanking extends CoreResource{
  trxnTypes: Array<LookupTrxnTypes> = [];
  trxnAllocationTypes: Array<LookupTrxnAllocationTypes> = [];

  constructor(model: any = <any>{})
  {
    super();
    const { trxnTypes, trxnAllocationTypes }  = model;
    this.trxnTypes = ( trxnTypes || []).map(r => new LookupTrxnTypes(r));
    this.trxnAllocationTypes = ( trxnAllocationTypes || []).map(r => new LookupTrxnAllocationTypes(r));
  }
}

export class LookupBankingSerializer {
  fromJson(json: any): LookupBanking { return new LookupBanking(json); }
  toJson(data: any): any { return {}; }
}

