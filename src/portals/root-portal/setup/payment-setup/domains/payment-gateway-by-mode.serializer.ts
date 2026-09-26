import {CoreQueryOptions} from "@app-global";

export class PaymentGatewayByModeQueryOptions extends CoreQueryOptions {
    systemTypeId: any;
    modeId: any;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            systemTypeId: this.systemTypeId,
            modeId: this.modeId
        };
        return super.getParamByObject(obj);
    }
}

class PaymentModeGatewayMapper {
    id: number;
    modeId: number;
    gatewayId: number;
    modeName: string;
    gatewayName: string;
    isReceiptAllowed: boolean;
    isPaymentAllowed: boolean;
    status : boolean;

    constructor(model: any = <any>{}){
        const { id, modeId, gatewayId, modeName, gatewayName, isReceiptAllowed, isPaymentAllowed, status } = model;
        this.id = id;
        this.modeId = modeId;
        this.gatewayId = gatewayId;
        this.modeName = modeName;
        this.gatewayName = gatewayName;
        this.isReceiptAllowed = isReceiptAllowed;
        this.isPaymentAllowed = isPaymentAllowed;
        this.status = status;
    }
}

export class PaymentGatewayByMode extends PaymentModeGatewayMapper {
    isMobileWallet: boolean;
    isPOS: boolean;
    hasOptionalRefNo: boolean;
    systemTypeId: number;
    systemType: string;

    isReconciliationRequired: boolean;
    isReferenceNoRequired: boolean;

    identificationNo: string;
    providerSupportNo: string;

    providerAccountId: string;
    providerAccountName: string;
    providerAccountGroupId: number;
    providerAccountGroupName: string;

    realizationAccountId: string;
    realizationAccountName: string;
    realizationAccountGroupId: number;
    realizationAccountGroupName: string;

    orgTaskId: number;
    orgTaskScheduleId: number;
    recoFrequencyTypeName: string;
    recoNextDate: string;
    orgTaskName: string;
    systemTypeMasterType: string;
    constructor(model: any = <any>{}){
        super(model);
        const {
            id, systemTypeId, isMobileWallet, isPOS, hasOptionalRefNo, identificationNo,
            isReconciliationRequired, isReferenceNoRequired,
            providerSupportNo,
            providerAccountId, providerAccountName, providerAccountGroupId, providerAccountGroupName,
            realizationAccountId, realizationAccountName, realizationAccountGroupId, realizationAccountGroupName,
            orgTaskId, orgTaskScheduleId, orgTaskName, recoFrequencyTypeName, recoNextDate,
            systemTypeMasterType
        } = model;
        this.id = id;
        this.systemTypeId = systemTypeId;

        this.isMobileWallet = isMobileWallet;
        this.isPOS = isPOS;
        this.hasOptionalRefNo = hasOptionalRefNo;
        this.identificationNo = identificationNo;
        this.isReconciliationRequired = isReconciliationRequired;
        this.isReferenceNoRequired = isReferenceNoRequired;
        this.orgTaskId = orgTaskId;
        this.orgTaskScheduleId = orgTaskScheduleId;

        this.providerSupportNo = providerSupportNo;

        this.providerAccountId = providerAccountId;
        this.providerAccountName = providerAccountName;
        this.providerAccountGroupId = providerAccountGroupId;
        this.providerAccountGroupName = providerAccountGroupName;

        this.realizationAccountId = realizationAccountId;
        this.realizationAccountName = realizationAccountName;
        this.realizationAccountGroupId = realizationAccountGroupId;
        this.realizationAccountGroupName = realizationAccountGroupName;

        this.orgTaskName = orgTaskName;
        this.recoFrequencyTypeName = recoFrequencyTypeName;
        this.recoNextDate = recoNextDate;
        this.systemTypeMasterType = systemTypeMasterType;
    }
}

export class PaymentGatewayByModeSerializer {
  fromJson(json: any): PaymentGatewayByMode { return new PaymentGatewayByMode(json); }
  toJson(data: any): any { return data; }
}
