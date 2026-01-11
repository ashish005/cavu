import {CoreQueryOptions} from "@app-global";

export class LookupQueryOptions extends CoreQueryOptions{
    isItemInvoice: string;
    isCreditTrxn: string;

    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            isItemInvoice:this.isItemInvoice,
            isCreditTrxn: this.isCreditTrxn
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class GatewayServiceCharge {
    id: number;
    mapperId: number;
    cardTypeId: number;
    serviceChargeRate: number;
    taxRate: number;
    trxnAmountFrom: number;
    trxnAmountTo: number;

    cardTypeName: string;
    status: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.mapperId = model.mapperId;
        this.cardTypeId = model.cardTypeId;
        this.serviceChargeRate = model.serviceChargeRate;

        this.taxRate = model.taxRate;
        this.trxnAmountFrom = model.trxnAmountFrom;
        this.trxnAmountTo = model.trxnAmountTo;

        this.cardTypeName = model.cardTypeName;
        this.status = model.status;
    }
}
export class ModeGatewayMapper {
    id: string;
    name: string;
    modeId: number;
    gatewayId: number;

    isReferenceNoRequired: boolean;
    hasAccount: boolean;

    systemTypeId: number;
    paymentSystemMaster: string;
    serviceCharges: Array<GatewayServiceCharge>;

    accountId: string;
    accountGroupId: number;

    constructor(model: any = {}) {
        const {
            id, name, gatewayId, isReferenceNoRequired,
            modeId, systemTypeId, paymentSystemMaster,
            hasAccount, accountId, accountGroupId, serviceCharges
        } = model;

        this.id = id;
        this.name = name;
        this.modeId = modeId;
        this.gatewayId = gatewayId;
        this.isReferenceNoRequired = isReferenceNoRequired;
        this.hasAccount = hasAccount;

        this.systemTypeId = systemTypeId;
        this.paymentSystemMaster = paymentSystemMaster;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.serviceCharges = (serviceCharges || []).map(r => new GatewayServiceCharge(r));
    }
}
export class GatewayMapper {
    systemTypeId: number;
    systemTypeName: string;
    groups: Array<ModeGatewayMapper>;

    constructor(model: any = {}) {
        const { systemTypeId, systemTypeName, groups } = model;
        this.systemTypeId = systemTypeId;
        this.systemTypeName = systemTypeName;
        this.groups = (groups || []).map(r => new ModeGatewayMapper(r));
    }
}