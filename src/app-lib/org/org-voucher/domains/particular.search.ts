export class TaxDetails {
    id: string;
    taxCode: string;
    taxRate: number;
    taxMapperId: number;
    taxCategoryId: number;

    constructor(model: any = <any>{}){
        const { id, taxCode, taxMapperId, taxCategoryId, taxRate } = model;
        this.id = id;
        this.taxCode = taxCode;
        this.taxMapperId = taxMapperId;
        this.taxCategoryId = taxCategoryId;
        this.taxRate = taxRate;
    }
}

export class Variant {
    id: string;
    barCode: string;
    sku: string;

    isFeatured: boolean;
    unitTypeId: number;
    purchaseUnitTypeId: number;
    purchaseHoldingQty: number;
    reorderLevel: number;
    reorderQuantity: number;

    productId: number;
    productCode: string;
    productTypeId: number;
    supplyTypeId: number;

    taxDetails: TaxDetails;
    constructor(model: any = <any>{}){
        const {
            id, barCode, sku, isFeatured, unitTypeId, purchaseUnitTypeId, purchaseHoldingQty, reorderLevel, reorderQuantity,
            productId, productCode, productTypeId, supplyTypeId,
            taxDetails
        } = model;
        this.id = id;
        this.barCode = barCode;
        this.sku = sku;

        this.isFeatured = isFeatured;
        this.unitTypeId = unitTypeId;
        this.purchaseUnitTypeId = purchaseUnitTypeId;
        this.purchaseHoldingQty = purchaseHoldingQty;
        this.reorderLevel = reorderLevel;
        this.reorderQuantity = reorderQuantity;

        this.productId = productId;
        this.productCode = productCode;
        this.productTypeId = productTypeId;
        this.supplyTypeId = supplyTypeId;

        this.taxDetails = new TaxDetails(taxDetails);
    }
}
export class ParticularSearchModal {
    //id: string;
    name: string;
    code: string;
    description: string;

    accountId: string;
    accountGroupId: number;

    accountGroupName: string;
    accountNatureName: string;

    //isReferenceNoRequired: boolean;

    mrp: number;
    price: number;
    balance: number;
    isDefaultLoyalty: boolean;
    isFixedPrice: boolean;
    isTaxInclusive: boolean;

    validFrom: string;
    variantId: string;

    variant: Variant;

    constructor(model: any = <any>{}){
        const { name, code, description, accountId, accountGroupId, accountGroupName, accountNatureName,
            variantId, mrp, price, balance, isDefaultLoyalty, isFixedPrice, isTaxInclusive, validFrom,
            isReferenceNoRequired, variant
        } = model;

        this.name = name;
        this.code = code;
        this.description = description;
        this.balance = balance;

        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.accountGroupName = accountGroupName;
        this.accountNatureName = accountNatureName;
        //this.isReferenceNoRequired = isReferenceNoRequired;
        this.variantId = variantId;
        this.mrp = mrp;
        this.price = price;
        this.isDefaultLoyalty = isDefaultLoyalty;
        this.isFixedPrice = isFixedPrice;
        this.isTaxInclusive = isTaxInclusive;
        this.validFrom = validFrom;

        this.variant = new Variant(variant);
    }
}