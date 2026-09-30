import {CoreResource} from "@app-global";

export class PaymentProviderLookup {
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
export class PaymentRailLookup {
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

export class InstrumentTypeLookup {
    id: number;
    name: string;
    code: string;
    description: string;
    sortOrder: number;

    constructor(model: any = <any>{}) {
        const {
            id, name, code, description, sortOrder
        } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.sortOrder = sortOrder;
    }
}

export class IdentifierTypeLookup {
    id: number;
    name: string;
    description: string;
    code: string;
    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, code,
            sortOrder,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}
// Combined Payment Setup Lookup
export class PaymentSetupLookup extends CoreResource {
    paymentProviders: PaymentProviderLookup[];
    paymentRails: PaymentRailLookup[];
    paymentModes: PaymentModeLookup[];
    paymentSystemTypes: PaymentSystemTypeLookup[];
    instrumentTypes: InstrumentTypeLookup[];
    identifierTypes: IdentifierTypeLookup[];
    constructor(model: any = <any>{}) {
        super();
        const { paymentProviders, paymentRails, paymentSystemTypes, instrumentTypes, identifierTypes } = model;
        this.paymentProviders = (paymentProviders || []).map(r => new PaymentProviderLookup(r));
        this.paymentRails = (paymentRails || []).map(r => new PaymentRailLookup(r));
        this.paymentSystemTypes = (paymentSystemTypes || []).map(r => new PaymentSystemTypeLookup(r));
        this.instrumentTypes = (instrumentTypes || []).map(r => new InstrumentTypeLookup(r));
        this.identifierTypes = (identifierTypes || []).map(r => new IdentifierTypeLookup(r));

        this.paymentModes = (this.paymentSystemTypes ?? []).flatMap(x => x.paymentModes ?? []);
    }

    getSystemTypeByName = (code: string) => this.paymentSystemTypes.find(k => k.code == code);
    getRailByCode = (code: any) => this.paymentRails.find(k => k.code == code);
    getProviderByCode = (code: any) => this.paymentProviders.find(k => k.code == code);
    getInstrumentByCode = (code: any) => this.instrumentTypes.find(k => k.code == code);
    getIdentifierTypeByCode = (code: any) => this.identifierTypes.find(k => k.code == code);
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
// }
export class PaymentSetupLookupSerializer {
  fromJson(json: any): PaymentSetupLookup { return new PaymentSetupLookup(json); }
  toJson(data: any): any { return {}; }
}
