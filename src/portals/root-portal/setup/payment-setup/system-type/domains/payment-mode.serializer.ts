import {CoreQueryOptions} from "@app-global";
export class PaymentModeQueryOptions extends CoreQueryOptions {
    systemTypeId: any;
    constructor(model: any = {}){super(model);}
    override toQueryString (){
        const obj = {
            systemTypeId: this.systemTypeId
        };
        return super.getParamByObject(obj);
    }
}

export class PaymentMode {
    id: number;
    name: string;
    code: string;
    description: string;

    systemTypeId: number;
    supportsRefund: boolean;
    supportsPartialRefund: boolean;
    supportsRecurring: boolean;
    supportsMandate: boolean;
    supportsTokenization: boolean;
    supportsAuthorizationCapture: boolean;
    supportsOffline: boolean;
    requiresExternalReference: boolean;

    paymentRailCount: boolean;
    bankInstrumentCount: boolean;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, code, description,
            systemTypeId, supportsRefund, supportsPartialRefund,
            supportsRecurring, supportsMandate, supportsTokenization,
            supportsAuthorizationCapture, supportsOffline, requiresExternalReference,
            paymentRailCount, bankInstrumentCount,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;

        this.systemTypeId = systemTypeId;
        this.supportsRefund = supportsRefund;
        this.supportsPartialRefund = supportsPartialRefund;
        this.supportsRecurring = supportsRecurring;

        this.supportsMandate = supportsMandate;
        this.supportsTokenization = supportsTokenization;
        this.supportsAuthorizationCapture = supportsAuthorizationCapture;
        this.supportsOffline = supportsOffline;
        this.requiresExternalReference = requiresExternalReference;

        this.paymentRailCount = paymentRailCount;
        this.bankInstrumentCount = bankInstrumentCount;
        this.isActive = isActive;
    }
}

export class PaymentModeSerializer {
    fromJson(json: any): PaymentMode { return new PaymentMode(json); }
    toJson(data: any): any { return data; }
}
