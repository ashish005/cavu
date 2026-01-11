export class ProductVariant  {
    id: any;
    productId: string;
    barCode: string;
    sku: string;
    name: string;
    description: string;
    isFeatured: boolean;
    purchaseHoldingQty: number;
    reorderLevel: number;
    reorderQuantity: number;
    unitTypeId:  number;
    unitTypeName:  string;
    unitTypeShortName:  string;
    purchaseUnitTypeId:  number;

    constructor(model: any = <any>{}){
        const {
            id, productId, barCode, sku, description, isFeatured, name, purchaseHoldingQty, reorderLevel, reorderQuantity,
            unitTypeId, unitTypeName, unitTypeShortName, purchaseUnitTypeId
        } = model;
        this.id = id;
        this.productId = productId;
        this.barCode = barCode;
        this.sku = sku;
        this.description = description;
        this.isFeatured = isFeatured;
        this.name = name;
        this.purchaseHoldingQty = purchaseHoldingQty;
        this.reorderLevel = reorderLevel;
        this.reorderQuantity = reorderQuantity;
        this.unitTypeId = unitTypeId;
        this.unitTypeName = unitTypeName;
        this.unitTypeShortName = unitTypeShortName;
        this.purchaseUnitTypeId = purchaseUnitTypeId;
    }
}

export class ProductPriceVariant {
    id: any;
    validFrom: string;
    supplyPrice: number;
    mrp: number;
    retailPrice: number;
    isTaxInclusive: boolean;
    isFixedPrice: boolean;
    isDefaultLoyalty: boolean;
    loyaltyPoint: number;
    adjustedPurchaseCost: number;
    variant: ProductVariant;

    constructor(model: any = <any>{}){
        const {
            id, validFrom, supplyPrice, mrp, retailPrice, isTaxInclusive, isFixedPrice, isDefaultLoyalty, loyaltyPoint, adjustedPurchaseCost,
            variant
        } = model;
        this.id = id;
        this.validFrom = validFrom;
        this.supplyPrice = supplyPrice;
        this.mrp = mrp;
        this.retailPrice = retailPrice;
        this.isTaxInclusive = isTaxInclusive;
        this.isFixedPrice = isFixedPrice;
        this.isDefaultLoyalty = isDefaultLoyalty;
        this.loyaltyPoint = loyaltyPoint;
        this.adjustedPurchaseCost = adjustedPurchaseCost;
        this.variant = new ProductVariant(variant);
    }
}