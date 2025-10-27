import {CoreQueryOptions} from "@app-global";

export class VoucherTypeQueryOptions extends CoreQueryOptions{
    startDate: string;
    constructor(){super();}

    override toQueryString ()
    {
        const obj = {
            startDate: this.startDate
        };
        return super.getParamByObject(obj);
    }
}

export class PhaseStatusLookup {
    id: string;
    name: string;
    sortOrder: number;
    isDefault: boolean;
    constructor(model: any = <any>{}){
        const { id, name, sortOrder, isDefault }  = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

class VoucherTypeLookup {
    phaseStatuses: PhaseStatusLookup;
    constructor(model: any = <any>{}) {
        const { phaseStatuses } = model;
        this.phaseStatuses = (phaseStatuses || []).map(r => new PhaseStatusLookup(r));
    }
}

export class VoucherConfig {
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

class VoucherPhase{
    id: number;
    name: string;
    description: string;
    color: string;
    sortOrder: number;
    hasPhaseStatus: boolean;
    notifyToAssignee: boolean;
    assignedToRoleId: boolean;
    notifyToParty: boolean;
    reportedToPartyId: boolean;
    turnAroundTime: number;
    skipCheckTillAmount: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, color, sortOrder, hasPhaseStatus,
            notifyToAssignee, assignedToRoleId, notifyToParty, reportedToPartyId, turnAroundTime, skipCheckTillAmount,
            isActive
        } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.sortOrder = sortOrder;
        this.hasPhaseStatus = hasPhaseStatus;
        this.notifyToAssignee = notifyToAssignee;
        this.assignedToRoleId = assignedToRoleId;
        this.notifyToParty = notifyToParty;
        this.reportedToPartyId = reportedToPartyId;
        this.turnAroundTime = turnAroundTime;
        this.skipCheckTillAmount = skipCheckTillAmount;
        this.isActive = isActive;
    }
}

export class VoucherType {
    id: string;
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
    voucherNo: string;

    enableAccounting: boolean;
    enableInventory: boolean;
    isActive: boolean;
    config: VoucherConfig;
    phases: Array<VoucherPhase>;
    constructor(model: any = <any>{}){
        const {
            id, name, masterType, abbreviation,
            configId, config, phases,
            isPrimary, primaryEntity, voucherNoDisplay, voucherDateDisplay, voucherNo,
            sortOrder, isDefault, totalVoucherCount,
            enableAccounting, enableInventory, isActive
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
        this.voucherNo = voucherNo;
        this.enableAccounting = enableAccounting;
        this.enableInventory = enableInventory;
        this.isActive = isActive;
        this.config = new VoucherConfig(config);
        this.phases = (phases || []).map(r => new VoucherPhase(r));
    }
}

export class VoucherTypeSerializer {
    fromDataJson(json: any): VoucherTypeLookup { return new VoucherTypeLookup(json); }
    fromJson(json: any): VoucherType { return new VoucherType(json); }
    toJson(data: any): any { return data; }
}
