import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProductPriceVariant extends CoreResource {
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
        super();
        const {
            id, validFrom, supplyPrice, mrp, retailPrice, isTaxInclusive, isFixedPrice, isDefaultLoyalty, loyaltyPoint, adjustedPurchaseCost,
            variant, userAuditInfo
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

export class ProductVariantTaxInfo {
    name: string;
    rate: string;
    constructor(model: any = <any>{}){
        const { name, rate } = model;
        this.name = name;
        this.rate = rate;
    }
}

export class ProductVariant extends CoreResource {
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

    product: string;
    productType: string;
    supplyType: string;
    brand: string;
    division: string;
    taxInfo: ProductVariantTaxInfo;
    prices: Array<ProductPriceVariant>;

    constructor(model: any = <any>{}){
        super();
        const {
            id, productId, barCode, sku, description, isFeatured, name, purchaseHoldingQty, reorderLevel, reorderQuantity,
            unitTypeId, unitTypeName, unitTypeShortName, purchaseUnitTypeId,
            productType, supplyType, brand, division, taxInfo, product, prices
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

        this.product = product;
        this.productType = productType;
        this.supplyType = supplyType;
        this.brand = brand;
        this.division = division;
        this.taxInfo = new ProductVariantTaxInfo(taxInfo);
        this.prices = (prices || []).map(r => new ProductPriceVariant(r));
    }
}

export class ProductQueryOptions extends CoreQueryOptions{
  orgUserId: string;
  accountId: string;
  constructor(model: any = {}){
      super(model);
  }

  override toQueryString (){
      const obj = {
          orgUserId:this.orgUserId,
          accountId:this.accountId
      };
      return super.getParamByObject(obj);
  }
}

/*export class ProductCategoryMapper {
    id: number;
    productId: number;
    categoryId: number;
    categoryTypeId: number;
    constructor(model: any = {})
    {
        const { id, productId, categoryId, categoryTypeId} = model;
        this.id = id;
        this.productId = productId;
        this.categoryId = categoryId;
        this.categoryTypeId = categoryTypeId;
    }
}*/

export class Product extends CoreResource {
    name: string;
    shortName: string;
    code: string;
    description: string;

    brandId: number;
    divisionId: number;
    vendorId: number;
    procurementTypeId: number;

    productTypeId: string;
    marginPercentage: number;
    minimumStock: number;

    supplyTypeId: number;
    taxMapperId: number;
    categoryTypeId: number;


    brand: string;
    division: string;
    vendor: string;
    productType: string;
    supplyType: string;
    procurementType: string;

    nature: string;
    variantCount: number;
    attributes: Array<any>;
    variants: Array<ProductVariant>;
    categoryMapper: Array<number>;
    transactionCount: number;
    status: string;
    taxInfo: ProductVariantTaxInfo;
    constructor(model: any = <any>{}){
        super();
        const {id, name, shortName, code, description, productTypeId,
            marginPercentage, minimumStock, status, supplyTypeId, taxMapperId,
            brandId, divisionId, vendorId, procurementTypeId,
            variantCount, transactionCount, userAuditInfo, brand, division, vendor, productType, supplyType, procurementType, taxInfo,
            attributes, categoryMapper, variants,
            nature, categoryTypeId
        } = model;
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.code = code;
        this.description = description;
        this.productTypeId = productTypeId;
        this.marginPercentage = marginPercentage;
        this.minimumStock = minimumStock;

        this.brandId = brandId;
        this.divisionId = divisionId;
        this.vendorId = vendorId;
        this.procurementTypeId = procurementTypeId;

        this.supplyTypeId = supplyTypeId;
        this.taxMapperId = taxMapperId;
        this.categoryTypeId = categoryTypeId;

        this.variantCount = variantCount;
        this.attributes = (attributes || []).map(r => r);
        this.categoryMapper = (categoryMapper || []);
        this.variants = (variants || []).map(r => new ProductVariant(r));

        this.brand = brand;
        this.division = division;
        this.vendor = vendor;
        this.productType = productType;
        this.supplyType = supplyType;
        this.productType = productType;
        this.procurementType = procurementType;

        this.nature = nature;
        this.transactionCount = transactionCount;
        this.status = status;
        this.taxInfo = new ProductVariantTaxInfo(taxInfo);
    }
}


export class ProductSerializer {
  fromJson(json: any): Product {
    return new Product(json);
  }
  toJson(model: Product): any {
    return model;
  }
}
