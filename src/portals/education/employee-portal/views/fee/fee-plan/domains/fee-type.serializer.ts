/*class RateList {
    id: string;
    name: string;
    rate: number;
    extraTaxRate: number;
    hasExtraTaxRate: number;
    status: string;
    sortOrder: number;
    parentId: number;
    supplyTypeId: number;
    supplyType: string;
    taxCategoryId: number;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.rate = model.rate;
        this.name = model.name;
        this.extraTaxRate = model.extraTaxRate;
        this.hasExtraTaxRate = model.hasExtraTaxRate;
        this.status = model.status;
        this.sortOrder = model.sortOrder;
        this.parentId = model.parentId;
        this.supplyTypeId = model.supplyTypeId;
        this.supplyType = model.supplyType;
        this.taxCategoryId = model.taxCategoryId;
    }
}*/

import {CoreQueryOptions, STATUS_ENUM} from "@app-global";

export class FeeTypeQueryOptions extends CoreQueryOptions{
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class FeeTypeTax {
    id: number;
    feeTypeId: number;
    studyLevelTypeId: number;
    studyModeTypeId: number;
    taxMapperId: number;
    name: string;
    rate: number;
    status: any;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.feeTypeId = model.feeTypeId;
        this.studyLevelTypeId = model.studyLevelTypeId;
        this.studyModeTypeId = model.studyModeTypeId;
        this.taxMapperId = model.taxMapperId;
        this.name = model.name;
        this.rate = model.rate;
        this.status = model.status;
    }
}

export class FeeType {
    id: string;
    name: string;
    amount: number;
    accountId: number;
    accountName: string;

    sortOrder: number;

    isRefundable: boolean;

    defaultFrequencyTypeId: number;
    defaultFrequencyMasterType: string;
    defaultFrequencyName: string;
    depositDurationType: string;

    voucherTypeId: number;
    voucherTypeName: string;
    defaultTaskId: number;
    defaultTaskName: string;

    defaultDay: number;
    defaultMonth: number;
    feeTaxes: Array<FeeTypeTax>;

    constructor(model: any = <any>{}) {
        const {
            id, name, amount,
            accountId, accountName,
            defaultTaskId, defaultTaskName, voucherTypeId, voucherTypeName,
            defaultFrequencyTypeId, defaultFrequencyName, defaultFrequencyMasterType, depositDurationType,
            defaultDay, defaultMonth, isRefundable, sortOrder
        } = model;
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.accountId = accountId;
        this.accountName = accountName;

        this.voucherTypeId = voucherTypeId;
        this.defaultTaskId = defaultTaskId;
        this.voucherTypeName = voucherTypeName;
        this.defaultTaskName = defaultTaskName;

        this.defaultFrequencyTypeId = defaultFrequencyTypeId;
        this.defaultFrequencyMasterType = defaultFrequencyMasterType;
        this.defaultFrequencyName = defaultFrequencyName;
        this.depositDurationType = depositDurationType;

        this.sortOrder = sortOrder;
        this.isRefundable = isRefundable;

        this.defaultDay = defaultDay;
        this.defaultMonth = defaultMonth;
        this.feeTaxes = (model.feeTaxes || []).map(r => new FeeTypeTax(r));
    }

    get hasEventFrequency() {
        return ('ON_EVENT' === this.defaultFrequencyMasterType);
    }
}

export class FeeTypeSerializer {
    fromJson(json: any): FeeType { return new FeeType(json); }
    toJson(data: any): any {
        (data.feeTaxes || []).map(r => r.status = r.status? STATUS_ENUM.ACTIVE: STATUS_ENUM.INACTIVE);
        return data;
    }
}