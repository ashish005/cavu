import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProductLookupQueryOptions extends CoreQueryOptions {
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

export class AttributeTypeLookup {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class TokenTypeLookup {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class BrandLookup extends CoreResource{
    name: string;
    constructor(model: any = <any>{}){
        super();
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class DivisionLookup extends CoreResource{
    name: string;
    constructor(model: any = <any>{}){
        super();
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}
export class UnitTypeLookup {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}


export class SupplyTypeLookup {
    id: number;
    name: string;
    isDefault: boolean;
    constructor(model: any = <any>{}){
        const { id, name, isDefault } = model;
        this.id = id;
        this.name = name;
        this.isDefault = isDefault;
    }
}
export class SupplyNatureLookup {
    id: number;
    name: string;
    masterType: string;
    isDefault: boolean;
    sortOrder: number;

    constructor(model: any = <any>{}){
        const { id, name, masterType, isDefault, sortOrder } = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }
}

export class PurchaseTypeLookup {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class CalcTypeLookup {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model;
        this.id = id;
        this.name = name;
    }
}

export class ProductTypeLookup {
    id: number;
    name: string;
    masterType: string;
    isDefault: boolean;
    sortOrder: number;
    natureId: number;
    natureType: string;

    constructor(model: any = <any>{}){
        const { id, name, masterType, isDefault, sortOrder, natureId, natureType } = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
        this.natureId = natureId;
        this.natureType = natureType;
    }
}
export class TaxMapperLookup extends CoreResource{
    name: string;
    sortOrder: number;
    categoryId: number;
    rate: number;
    taxTypeRateId: number;
    supplyTypeId: number;
    constructor(model: any = <any>{}){
        super();
        const { id, name, sortOrder, categoryId, rate, taxTypeRateId, supplyTypeId } = model;
        this.id = id;
        this.name = name;
        this.sortOrder = sortOrder;
        this.categoryId = categoryId;
        this.rate = rate;
        this.taxTypeRateId = taxTypeRateId;
        this.supplyTypeId = supplyTypeId;
    }
}

export class ProcurementTypeLookup {
    id: number;
    name: string;
    description: string;
    masterType: string;
    constructor(model: any = <any>{}){
        const { id, name, description, masterType } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.masterType = masterType;
    }
}

export class CategoryLookup {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    publishedDate: string;
    displayIndex: number;
    tags: number;
    constructor(model: any = <any>{}){
        const { id, name, description, imageUrl, publishedDate, displayIndex, tags } = model;
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.publishedDate = publishedDate;
        this.displayIndex = displayIndex;
        this.tags = tags;
    }
}

export class CategoryTypeLookup {
    id: number;
    name: string;
    code: string;
    categories: Array<CategoryLookup>;
    constructor(model: any = <any>{}){
        const { id, name, categories } = model;
        this.id = id;
        this.name = name;
        this.categories = (categories || []).map(r => new CategoryLookup(r));
    }
}

export class ProductType {
    id: number;
    name: string;
    masterType: string;
    isDefault: boolean;
    sortOrder: number;
    natureId: number;
    natureType: string;

    constructor(model: any = <any>{}){
        const { id, name, masterType, isDefault, sortOrder, natureId, natureType } = model;
        this.id = id;
        this.name = name;
        this.masterType = masterType;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
        this.natureId = natureId;
        this.natureType = natureType;
    }
}

export class ProductLookup extends CoreResource
{
    brands: Array<BrandLookup>;
    divisions: Array<DivisionLookup>;
    productTypes: Array<ProductTypeLookup>;

    supplyNature: Array<SupplyNatureLookup>;
    supplyTypes: Array<SupplyTypeLookup>;
    taxMapper: Array<TaxMapperLookup>;

    procurementTypes: Array<ProcurementTypeLookup>;
    categoryTypes: Array<CategoryTypeLookup>;
    unitTypes: Array<UnitTypeLookup>;
    tokenTypes: Array<TokenTypeLookup>;

    purchaseTypes: Array<PurchaseTypeLookup>;
    calcTypes: Array<CalcTypeLookup>;
    attributeTypes: Array<AttributeTypeLookup>;


    //activeCategories: Array<CategoryLookup>; //for ui population

    constructor(model: any = <any>{}){
        super();
        const {
            brands, divisions, productTypes, supplyTypes, supplyNature, taxMapper, procurementTypes,
            categoryTypes,
            unitTypes, tokenTypes,
            purchaseTypes, calcTypes, attributeTypes
        } = model;
        this.brands = (brands || []).map(r => new BrandLookup(r));
        this.divisions = (divisions || []).map(r => new DivisionLookup(r));
        this.productTypes = (productTypes || []).map(r => new ProductTypeLookup(r));

        this.supplyTypes = (supplyTypes || []).map(r => new SupplyTypeLookup(r));
        this.supplyNature = (supplyNature || []).map(r => new SupplyNatureLookup(r));

        this.taxMapper = (taxMapper || []).map(r => new TaxMapperLookup(r));
        this.procurementTypes = (procurementTypes || []).map(r => new ProcurementTypeLookup(r));
        this.categoryTypes = (categoryTypes || []).map(r => new CategoryTypeLookup(r));
        this.unitTypes = (unitTypes || []).map(r => new UnitTypeLookup(r));
        this.tokenTypes = (tokenTypes || []).map(r => new TokenTypeLookup(r));

        this.purchaseTypes = (purchaseTypes || []).map(r => new PurchaseTypeLookup(r));
        this.calcTypes = (calcTypes || []).map(r => new CalcTypeLookup(r));

        this.supplyTypes = (supplyTypes || []).map(r => new DivisionLookup(r));
        this.attributeTypes = (attributeTypes || []).map(r => new AttributeTypeLookup(r));
    }

    productTypesByNature(nature){
        //if(!nature) return this.getServiceSupplyNature();
        return this.productTypes.filter(r => r.natureType == nature);
    }
    getServiceSupplyNature(){ return this.productTypes.find(r => r.masterType == 'service'); }

    populateActiveCategories(val){
        return this.categoryTypes.find(r => r.id == val)?.categories || [];
    }
}

export class ProductLookupSerializer
{
    fromJson(json: any): ProductLookup { return new ProductLookup(json); }
    toJson(data: any): any { return {}; }
}
