
import {CoreQueryOptions} from "@app-global";

export class PaymentGatewayQueryOptions extends CoreQueryOptions {
    systemTypeId: any;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            systemTypeId: this.systemTypeId
        };
        return super.getParamByObject(obj);
    }
}

class ServiceCharge {
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

class PaymentMode {
    id: number;
    name: string;

    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

class GatewayAccountInfo {
    accountId: string;
    accountGroupId: string;

    account: string;
    accountGroup: string;
    groupMasterType: string;

    constructor(model: any = <any>{}){
        const { id, accountId, accountGroupId, groupMasterType, account, accountGroup  } = model;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.groupMasterType = groupMasterType;
        this.account = account;
        this.accountGroup = accountGroup;
    }
}

export class PaymentGateway extends MasterDomain {
    id: string;
    name: string;
    isMobileWallet: boolean;
    isPOS: boolean;
    systemTypeId: number;
    systemType: string;

    isReconciliationRequired: boolean;
    isReferenceNoRequired: boolean;
    recoFrequencyTypeId: number;
    recoFrequencyType: string;

    pOSNo: string;
    providerSupportNo: string;
    providerAccount: GatewayAccountInfo;
    realizationAccount: GatewayAccountInfo;

    orgTaskId: string;
    modes: Array<PaymentMode>;
    serviceCharges: Array<ServiceCharge>;
    constructor(model: any = <any>{}){
        super(model);
        const {
            id, name, systemTypeId, systemType, isMobileWallet, isPOS, pOSNo,
            isReconciliationRequired, isReferenceNoRequired, recoFrequencyTypeId, recoFrequencyType,
            providerSupportNo, providerAccount, realizationAccount,
            modes, serviceCharges
        } = model;
        this.id = id;
        this.name = name;
        this.systemTypeId = systemTypeId;
        this.systemType = systemType;
        this.isMobileWallet = isMobileWallet;
        this.isPOS = isPOS;
        this.pOSNo = pOSNo;
        this.isReconciliationRequired = isReconciliationRequired;
        this.isReferenceNoRequired = isReferenceNoRequired;
        this.recoFrequencyTypeId = recoFrequencyTypeId;
        this.recoFrequencyType = recoFrequencyType;

        this.providerSupportNo = providerSupportNo;
        this.providerAccount = new GatewayAccountInfo(providerAccount);
        this.realizationAccount = new GatewayAccountInfo(realizationAccount);
        this.modes = (modes || []).map(r => new PaymentMode(r));
        this.serviceCharges = (serviceCharges || []).map(r => new ServiceCharge(r));
    }
}

export class PaymentGatewaySerializer {
  fromJson(json: any): PaymentGateway {
    return new PaymentGateway(json);
  }

  toJson(data: any): any {
    return {};
  }
}

