import {CoreQueryOptions} from "@app-global";

export class PaymentGatewayServiceChargeQueryOptions extends CoreQueryOptions {
    //systemTypeId: any;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            //systemTypeId: this.systemTypeId
        };
        return super.getParamByObject(obj);
    }
}

export class ServiceCharge {
    id: number;
    modeId: number;
    mapperId: number;
    cardTypeId: number;

    serviceChargeRate: number;
    taxRate: number;
    trxnAmountFrom: string;
    trxnAmountTo: string;

    modeName: string;
    modeDescription: string;
    isReceiptAllowed: boolean;
    isPaymentAllowed: boolean;
    cardTypeName: string;

    status: boolean;
    constructor(model: any = <any>{}){
        const { id, modeId, mapperId, cardTypeId,
            serviceChargeRate, taxRate, trxnAmountFrom, trxnAmountTo,
            modeName, modeDescription, isReceiptAllowed, isPaymentAllowed,
            cardTypeName, status
        } = model;
        this.id = id;
        //this.gatewayId = gatewayId;
        this.modeId = modeId;
        this.mapperId = mapperId;
        this.cardTypeId = cardTypeId;
        this.serviceChargeRate = serviceChargeRate;
        this.taxRate = taxRate;
        this.trxnAmountFrom = trxnAmountFrom;
        this.trxnAmountTo = trxnAmountTo;

        this.modeName = modeName;
        this.modeDescription = modeDescription;
        this.isReceiptAllowed = isReceiptAllowed;
        this.isPaymentAllowed = isPaymentAllowed;
        this.cardTypeName = cardTypeName;
        this.status = status;
    }
}

export class ServiceChargeSerializer {
    fromJson(json: any): ServiceCharge { return new ServiceCharge(json); }
    toJson(data: any): any { return data; }
}
