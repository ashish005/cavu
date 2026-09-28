import {CoreQueryOptions} from "@app-global";

export class BankIdentifierTypeQueryOptions extends CoreQueryOptions{
    constructor(){super();}
    override toQueryString ()
    {
        const obj = {};
        return super.getParamByObject(obj);
    }
}

export class BankIdentifierRule {
    id: number;
    countryId: number;
    bankIdentifierTypeId: number;

    name: string;
    code: string;
    countryName: string;

    isRequired: boolean;
    mustBeUnique: boolean;
    minLength: number;
    maxLength: number;
    validationPattern: string;
    checksumAlgorithm: string;
    normalizeBeforeValidation: string;
    example: string;

    effectiveFrom: string;
    effectiveTo: string;

    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, code,
            countryId, countryName,
            bankIdentifierTypeId,
            isRequired, mustBeUnique,
            minLength, maxLength, validationPattern, checksumAlgorithm, normalizeBeforeValidation, example,
            effectiveFrom, effectiveTo,
            sortOrder, isActive
        }  = model;

        this.id = id;
        this.name = name;
        this.code = code;
        this.countryId = countryId;
        this.countryName = countryName;
        this.bankIdentifierTypeId = bankIdentifierTypeId;
        this.isRequired = isRequired;
        this.mustBeUnique = mustBeUnique;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.validationPattern = validationPattern;
        this.checksumAlgorithm = checksumAlgorithm;
        this.normalizeBeforeValidation = normalizeBeforeValidation;
        this.example = example;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;

        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}

export class BankIdentifierType {
    id: number;
    name: string;
    description: string;
    code: string;
    countryCount: boolean;
    requiredCountryCount: boolean;
    activeRuleCount: boolean;
    sortOrder: number;
    isActive: boolean;
    constructor(model: any = <any>{}){
        const {
            id, name, description, code,
            countryCount, requiredCountryCount, activeRuleCount,
            sortOrder,
            isActive
        }  = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
        this.countryCount = countryCount;
        this.requiredCountryCount = requiredCountryCount;
        this.activeRuleCount = activeRuleCount;
        this.sortOrder = sortOrder;
        this.isActive = isActive;
    }
}

export class BankIdentifierTypeSerializer {
    fromJson(json: any): BankIdentifierType { return new BankIdentifierType(json); }
    toJson(data: any): any { return data; }
}
