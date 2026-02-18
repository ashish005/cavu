import {CoreResource} from "@app-global";

export class ServiceChargeLookup {
    id: number;
    name: string;
    gatewayId: number;
    modeId: number;
    cardTypeId: number;

    serviceChargeRate: number;
    taxRate: number;
    trxnAmountFrom: string;
    trxnAmountTo: string;


    mode: string;
    modeDescription: string;
    isReceiptAllowed: boolean;
    isPaymentAllowed: boolean;
    cardType: string;

    constructor(model: any = <any>{}){
        const { id, name, gatewayId, modeId, cardTypeId,
            serviceChargeRate, taxRate, trxnAmountFrom, trxnAmountTo,
            mode, modeDescription, isReceiptAllowed, isPaymentAllowed, cardType
        } = model;
        this.id = id;
        this.name = name;
        this.gatewayId = gatewayId;
        this.modeId = modeId;
        this.cardTypeId = cardTypeId;
        this.serviceChargeRate = serviceChargeRate;
        this.taxRate = taxRate;
        this.trxnAmountFrom = trxnAmountFrom;
        this.trxnAmountTo = trxnAmountTo;

        this.mode = mode;
        this.modeDescription = modeDescription;
        this.isReceiptAllowed = isReceiptAllowed;
        this.isPaymentAllowed = isPaymentAllowed;
        this.cardType = cardType;
    }
}

export class ModeGatewayMapperLookup {
    id: number;
    modeId: number;
    gatewayId: number;
    systemTypeId: number;

    modeName: string;
    isPaymentAllowed: boolean;
    isReceiptAllowed: boolean;

    constructor(model: any = <any>{}){
        const { id,modeId, gatewayId, systemTypeId, modeName, isPaymentAllowed, isReceiptAllowed } = model;
        this.id = id;
        this.modeId = modeId;
        this.gatewayId = gatewayId;
        this.systemTypeId = systemTypeId;

        this.modeName = modeName;
        this.isPaymentAllowed = isPaymentAllowed;
        this.isReceiptAllowed = isReceiptAllowed;
    }
}

class BankInstrumentTypeLookup {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class PaymentModeLookup {
    id: string;
    name: string;
    masterType: string;
    description: string;
    instrumentId: number;
    systemTypeId: number;

    constructor(model: any = <any>{}){
        const { id, name, masterType, description, instrumentId, systemTypeId }  = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.description = description;
        this.instrumentId = instrumentId;
        this.systemTypeId = systemTypeId;
    }
}

export class CardTypeLookup {
    id: string;
    name: string;
    //systemTypeId: number;

    constructor(model: any = <any>{}){
        const { id, name, systemTypeId}  = model;
        this.id = id;
        this.name = name;
        //this.systemTypeId = systemTypeId;
    }
}

export class PaymentSystemTypeLookup {
    id: string;
    name: string;
    masterType: string;

    constructor(model: any = <any>{}){
        const { id, name, masterType, paymentCardTypes, paymentGateways}  = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
    }

    isBank=()=> ('bank' == this.masterType)
}

export class TransactionTypeLookup {
    id: string;
    name: string;
    masterType: string;
    isPrimary: boolean;
    isTaxInclude: boolean;
    isLocked: boolean;

    constructor(model: any = <any>{}){
        const { id, name, masterType, isPrimary, isTaxInclude, isLocked}  = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.isPrimary = isPrimary;
        this.isTaxInclude = isTaxInclude;
        this.isLocked = isLocked;
    }
}

export class VoucherConfigLookup {
    id: string;
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
        }  = model;
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

export class VoucherTypeLookup {
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
    config: VoucherConfigLookup;

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
        this.config = new VoucherConfigLookup(config);
    }
}

export class PaymentGatewayLookup extends CoreResource{
    systemTypes: Array<PaymentSystemTypeLookup> = [];
    modes: Array<PaymentModeLookup> = [];
    bankInstrumentTypes: Array<BankInstrumentTypeLookup> = [];
    cardTypes: Array<CardTypeLookup> = [];
    voucherTypes: Array<VoucherTypeLookup> = [];
    constructor(model: any = <any>{}){
        super();
        const { systemTypes, modes, cardTypes, bankInstrumentTypes, voucherTypes }  = model;
        this.systemTypes = ( systemTypes || []).map(r => new PaymentSystemTypeLookup(r));
        this.cardTypes = ( cardTypes || []).map(r => new CardTypeLookup(r));
        this.bankInstrumentTypes = ( bankInstrumentTypes || []).map(r => new BankInstrumentTypeLookup(r));

        this.modes = (modes || []).map(r => new PaymentModeLookup(r));
        this.voucherTypes = ( voucherTypes || []).map(r => new VoucherTypeLookup(r));
    }
    getAllModes = () => this.modes;

    getSystemTypeByName = (systemMasterType: string) => this.systemTypes.find(k => k.masterType == systemMasterType);
    getModesBySystemTypeId = (systemTypeId: any) => this.modes.filter(k => k.systemTypeId == systemTypeId);
}

export class PaymentGatewayLookupSerializer {
  fromJson(json: any): PaymentGatewayLookup { return new PaymentGatewayLookup(json); }

  toJson(data: any): any {
    return {};
  }
}
