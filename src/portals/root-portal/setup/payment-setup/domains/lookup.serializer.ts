import {CoreResource} from "@app-global";

export class PaymentProvider {
    id: number;
    name: string;
    code: string;
    type: number;
    website: string;
    description: string;

    constructor(model: any = <any>{}) {
        const { id, name, code, type, website, description } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.type = type;
        this.website = website;
        this.description = description;
    }
}
// Payment Rail
export class PaymentRail {
    id: number;
    name: string;
    code: string;
    type: number;
    description: string;

    constructor(model: any = <any>{}) {
        const { id, name, code, type, description } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.type = type;
        this.description = description;
    }
}
// Payment Mode
export class PaymentModeLookup {
    id: number;
    name: string;
    code: string;
    description: string;
    systemTypeId: number;
    supportsRefund: boolean;
    supportsPartialRefund: boolean;
    supportsRecurring: boolean;
    supportsTokenization: boolean;

    constructor(model: any = <any>{}) {
        const { id, name, code, description, systemTypeId, supportsRefund, supportsPartialRefund, supportsRecurring, supportsTokenization } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.systemTypeId = systemTypeId;
        this.supportsRefund = supportsRefund;
        this.supportsPartialRefund = supportsPartialRefund;
        this.supportsRecurring = supportsRecurring;
        this.supportsTokenization = supportsTokenization;
    }
}
// Payment System Type
export class PaymentSystemTypeLookup {
    id: number;
    name: string;
    code: string;
    description: string;
    categoryName: string;
    supportsIncoming: boolean;
    supportsOutgoing: boolean;
    supportsRefund: boolean;
    paymentModes: Array<PaymentModeLookup>;

    constructor(model: any = <any>{}) {
        const { id, name, code, description, categoryName, supportsIncoming, supportsOutgoing, supportsRefund, paymentModes } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.categoryName = categoryName;
        this.supportsIncoming = supportsIncoming;
        this.supportsOutgoing = supportsOutgoing;
        this.supportsRefund = supportsRefund;

        this.paymentModes = (paymentModes || []).map(r => new PaymentModeLookup(r));
    }
}
// Country Payment Rail
export class CountryPaymentRail {
    id: number;
    countryId: number;
    paymentRailId: number;
    paymentRailName: string;
    paymentRailCode: string;
    supportsIncoming: boolean;
    supportsOutgoing: boolean;
    supportsRefund: boolean;
    supportsRecurring: boolean;
    supportsMandate: boolean;
    effectiveFrom: string;
    effectiveTo: string;

    constructor(model: any = <any>{}) {
        const { id, countryId, paymentRailId, paymentRailName, paymentRailCode, supportsIncoming, supportsOutgoing, supportsRefund, supportsRecurring, supportsMandate, effectiveFrom, effectiveTo } = model;
        this.id = id;
        this.countryId = countryId;
        this.paymentRailId = paymentRailId;
        this.paymentRailName = paymentRailName;
        this.paymentRailCode = paymentRailCode;
        this.supportsIncoming = supportsIncoming;
        this.supportsOutgoing = supportsOutgoing;
        this.supportsRefund = supportsRefund;
        this.supportsRecurring = supportsRecurring;
        this.supportsMandate = supportsMandate;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
    }
}
// Combined Payment Setup Lookup
export class PaymentSetupLookup extends CoreResource {
    paymentProviders: PaymentProvider[];
    paymentRails: PaymentRail[];
    paymentModes: PaymentModeLookup[];
    paymentSystemTypes: PaymentSystemTypeLookup[];
    countryPaymentRails: CountryPaymentRail[];
    constructor(model: any = <any>{}) {
        super();
        const { paymentProviders, paymentRails, paymentModes, paymentSystemTypes, countryPaymentRails } = model;
        this.paymentProviders = (paymentProviders || []).map(r => new PaymentProvider(r));
        this.paymentRails = (paymentRails || []).map(r => new PaymentRail(r));
        this.paymentSystemTypes = (paymentSystemTypes || []).map(r => new PaymentSystemTypeLookup(r));
        this.countryPaymentRails = (countryPaymentRails || []).map(r => new CountryPaymentRail(r));

        this.paymentModes = (this.paymentSystemTypes ?? []).flatMap(x => x.paymentModes ?? []);
    }

    getSystemTypeByName = (systemMasterType: string) => this.paymentSystemTypes.find(k => k.code == systemMasterType);
    getModesBySystemTypeId = (systemTypeId: any) => this.paymentModes.filter(k => k.systemTypeId == systemTypeId);
}
// export class PaymentGatewayLookup extends CoreResource{
//     systemTypes: Array<PaymentSystemTypeLookup> = [];
//     modes: Array<PaymentModeLookup> = [];
//     bankInstrumentTypes: Array<BankInstrumentTypeLookup> = [];
//     cardTypes: Array<CardTypeLookup> = [];
//     voucherTypes: Array<VoucherTypeLookup> = [];
//     constructor(model: any = <any>{}){
//         super();
//         const { paymentSystemTypes, modes, cardTypes, bankInstrumentTypes, voucherTypes }  = model;
//         this.paymentSystemTypes = ( systemTypes || []).map(r => new PaymentSystemTypeLookup(r));
//         this.cardTypes = ( cardTypes || []).map(r => new CardTypeLookup(r));
//         this.bankInstrumentTypes = ( bankInstrumentTypes || []).map(r => new BankInstrumentTypeLookup(r));
//
//         this.modes = (modes || []).map(r => new PaymentModeLookup(r));
//         this.voucherTypes = ( voucherTypes || []).map(r => new VoucherTypeLookup(r));
//     }
//     getAllModes = () => this.modes;
//
//     getSystemTypeByName = (systemMasterType: string) => this.systemTypes.find(k => k.masterType == systemMasterType);
//     getModesBySystemTypeId = (systemTypeId: any) => this.modes.filter(k => k.systemTypeId == systemTypeId);
// }
export class PaymentSetupLookupSerializer {
  fromJson(json: any): PaymentSetupLookup { return new PaymentSetupLookup(json); }
  toJson(data: any): any { return {}; }
}
