import {CoreQueryOptions, CoreResource} from "@app-global";
export class LookupGatewayAccountInfo {
    accountId: string;
    accountGroupId: string;
    groupMasterType: string;

    constructor(model: any = <any>{}){
        const { id, accountId, accountGroupId, groupMasterType } = model;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.groupMasterType = groupMasterType;
    }
}

class LookupPaymentGatewayModeMapper {
    id: string;
    modeId: number;
    gatewayId: number;
    systemTypeId: number;

    isPaymentAllowed: boolean;
    isReceiptAllowed: boolean;

    modeName: string;
    gatewayName: string;

    isReferenceNoRequired: boolean;
    hasPaymentAllowed: boolean;
    hasReceiptAllowed: boolean;
    constructor(model: any = <any>{}){
        const {
            id, modeId, gatewayId, systemTypeId,
            isPaymentAllowed, isReceiptAllowed,
            modeName, gatewayName,
            isReferenceNoRequired,
            hasPaymentAllowed, hasReceiptAllowed
        } = model;
        this.id = id;
        this.modeId = modeId;
        this.gatewayId = gatewayId;
        this.systemTypeId = systemTypeId;

        this.isPaymentAllowed = isPaymentAllowed;
        this.isReceiptAllowed = isReceiptAllowed;

        this.modeName = modeName;
        this.gatewayName = gatewayName;

        this.isReferenceNoRequired = isReferenceNoRequired;
        this.hasPaymentAllowed = hasPaymentAllowed;
        this.hasReceiptAllowed = hasReceiptAllowed;
    }
    get name() { return `${this.gatewayName} ${ (this.gatewayName != this.modeName) ? ' - '+ this.modeName:'' }`; }
}

export class LookupPaymentGateway extends LookupPaymentGatewayModeMapper {
    // isMobileWallet: boolean;
    // isPOS: boolean;
    // isReconciliationRequired: boolean;
    // isReferenceNoRequired: boolean;
    // recoFrequencyTypeId: number;
    // recoFrequencyType: string;
    // posNo: string;
    providerAccount: LookupGatewayAccountInfo;
    realizationAccount: LookupGatewayAccountInfo;
    // providerSupportNo: string;
    // orgTaskId: string;
    //serviceCharges: Array<LookupServiceCharge>;
    constructor(model: any = <any>{}){
        super(model);
        const {
            isMobileWallet, isPOS, pOSNo,
            isReconciliationRequired, isReferenceNoRequired, recoFrequencyTypeId, recoFrequencyType,
            providerSupportNo,
            providerAccount, realizationAccount,
            serviceCharges
        } = model;
        // this.name = name;
        // this.isMobileWallet = isMobileWallet;
        // this.isPOS = isPOS;
        // this.pOSNo = pOSNo;
        // this.isReconciliationRequired = isReconciliationRequired;
        // this.isReferenceNoRequired = isReferenceNoRequired;
        // this.recoFrequencyTypeId = recoFrequencyTypeId;
        // this.recoFrequencyType = recoFrequencyType;
        // this.providerSupportNo = providerSupportNo;
        this.providerAccount = new LookupGatewayAccountInfo(providerAccount);
        this.realizationAccount = new LookupGatewayAccountInfo(realizationAccount);
        // this.serviceCharges = (serviceCharges || []).map(r => new LookupServiceCharge(r));
    }
}
export class ExpenseLookupQueryOptions extends CoreQueryOptions {
    countryId: string;

    constructor(model: any = {}){
        super(model);
        this.countryId = model.countryId || '';
    }

    override toQueryString (){
        const obj = {
            countryId:this.countryId
        };
        return super.getParamByObject(obj);
    }
}

export class LookupVoucherType {
    id: any;
    name: string;
    masterType: string;
    constructor(model: any = {}){
        const {id, name, masterType} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
    }
}

export class LookupAccountNature {
    id: any;
    name: string;
    masterType: string;
    constructor(model: any = {}){
        const {id, name, masterType} = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
    }
}

export class LookupAccountGroup {
    id: any;
    name: string;
    sortOrder: string;
    accountNatureId: number;
    accountCount: number;
    isLocked: boolean;
    children: Array<LookupAccountGroup>;
    constructor(model: any = {}){
        const {id, name, sortOrder, accountCount, accountNatureId, isLocked, children} = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.accountCount = accountCount;
        this.accountNatureId = accountNatureId;
        this.isLocked = isLocked;
        this.children = (children || []).map(r => new LookupAccountGroup(r));
    }

    flatChildren()
    {
        return (this.children || []).reduce((acc, val) =>
        {
            const v = val.flatChildren();
            if(v.length)
            {
                acc.push(...v);
            }
            acc.push(val);
             return acc;
        }, []);
    }
}

export class ExpenseLookup extends CoreResource{
    voucherType: LookupVoucherType;
    accountNature: LookupAccountNature;
    accountGroup: Array<LookupAccountGroup>;
    gateways: Array<LookupPaymentGateway>;
    flatAccountGroups: Array<LookupAccountGroup>;
    constructor(model: any = <any>{}){
        super();
        const { voucherType, accountNature, accountGroup, gateways } = model;
        this.voucherType = new LookupVoucherType(voucherType);
        this.accountNature = new LookupAccountNature((accountNature || [])[0]);
        this.accountGroup =  (accountGroup || []).map(r => new LookupAccountGroup(r));
        this.gateways = (gateways || []).map(r => new LookupPaymentGateway(r));
        this.flatAccountGroups = (this.accountGroup || []).reduce((result, curr)=>{
            result.push(curr);
            const v = curr.flatChildren();
            if(v.length) {
                result.push(...v);
            }
            return result;
        }, []);
    }

    findGroupById(groupId)
    {
        return this.flatAccountGroups.find(r => r.id == groupId);
    }
}

export class ExpenseLookupSerializer {
    fromJson(json: any): ExpenseLookup {
        return new ExpenseLookup(json);
    }

    toJson(data: any): any {
        return {};
    }
}
