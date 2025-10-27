import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {VoucherType, VoucherTypeSerializer} from "../domains/voucher-type.serializer";
import {VoucherCalcType, VoucherCalcTypeSerializer} from "../domains/calc-type.serializer";
import {VoucherSundryType, VoucherSundryTypeSerializer} from "../domains/sundry-type.serializer";
import {SaleChannel, SaleChannelSerializer} from "../domains/sale-channel.serializer";
import {StockTransferType, StockTransferTypeSerializer} from "../domains/stock-transfer-type.serializer";
import {QuoteType, QuoteTypeSerializer} from "../domains/quotation-type.serializer";
import {SaleType, SaleTypeSerializer} from "../domains/sale-type.serializer";
import {PurchaseType, PurchaseTypeSerializer} from "../domains/purchase-type.serializer";

@Injectable()
export class VoucherTypeService extends OrgResourceService<VoucherType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMasterType', new VoucherTypeSerializer()); }
}

@Injectable()
export class PurchaseTypeService extends OrgResourceService<PurchaseType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/purchaseType', new PurchaseTypeSerializer()); }
}

@Injectable()
export class SaleTypeService extends OrgResourceService<SaleType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/saleType', new SaleTypeSerializer()); }
}

@Injectable()
export class QuoteTypeService extends OrgResourceService<QuoteType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/quoteType', new QuoteTypeSerializer()); }
}

@Injectable()
export class StockTransferTypeService extends OrgResourceService<StockTransferType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/stockTransferType', new StockTransferTypeSerializer()); }
}
@Injectable()
export class SaleChannelService extends OrgResourceService<SaleChannel>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/saleChannel', new SaleChannelSerializer()); }
}

@Injectable()
export class VoucherSundryTypeService extends OrgResourceService<VoucherSundryType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/sundryType', new VoucherSundryTypeSerializer()); }
}

@Injectable()
export class VoucherCalcTypeService extends OrgResourceService<VoucherCalcType>{
    constructor(public override injector: Injector) { super(injector, 'voucherMaster/calcType', new VoucherCalcTypeSerializer()); }
}
