export class FeeTax {
    id: number;
    feeTypeId: number;
    name: string;

    studyLevelTypeId: number;
    studyModeTypeId: number;
    taxMapperId: number;

    categoryId: number;
    taxTypeRateId: number;
    hasExtraTaxRate: boolean;
    extraTaxRate: number;
    sortOrder: number;

    rate: number;
    status: any;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.feeTypeId = model.feeTypeId;
        this.name = model.name;

        this.studyLevelTypeId = model.studyLevelTypeId;
        this.studyModeTypeId = model.studyModeTypeId;
        this.taxMapperId = model.taxMapperId;

        this.categoryId = model.categoryId;
        this.taxTypeRateId = model.taxTypeRateId;
        this.hasExtraTaxRate = model.hasExtraTaxRate;
        this.extraTaxRate = model.extraTaxRate;
        this.sortOrder = model.sortOrder;

        this.rate = model.rate;
        this.status = model.status;
    }
}