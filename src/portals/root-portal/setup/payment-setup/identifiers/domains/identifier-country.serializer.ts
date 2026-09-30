import {CoreQueryOptions} from "@app-global";
export class IdentifierCountryQueryOptions extends CoreQueryOptions {
    identifierId: number;
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {
            identifierId: this.identifierId
        };
        return super.getParamByObject(obj);
    }
}

export class IdentifierCountry {
    id: number;
    countryId: number;
    bankIdentifierTypeId: number;
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
            id,
            countryId, countryName,
            bankIdentifierTypeId,
            isRequired, mustBeUnique,
            minLength, maxLength, validationPattern, checksumAlgorithm, normalizeBeforeValidation, example,
            effectiveFrom, effectiveTo,
            sortOrder, isActive
        }  = model;

        this.id = id;
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

export class IdentifierCountrySerializer {
    fromJson(json: any): IdentifierCountry { return new IdentifierCountry(json); }
    toJson(data: any): any { return data; }
}
