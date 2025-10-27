import {CoreResource} from "@app-global";
import {ProductVariant, ProductVariantTaxInfo} from "./variant.serializer";

export class ProductById extends CoreResource {
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
    vendorName: string;
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
            variantCount, transactionCount, userAuditInfo, brand, division, vendorName, productType, supplyType, procurementType, taxInfo,
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
        this.vendorName = vendorName;
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

export class ProductByIdSerializer {
    fromJson(json: any): ProductById { return new ProductById(json); }
    toJson(model: ProductById): any { return model; }
}
