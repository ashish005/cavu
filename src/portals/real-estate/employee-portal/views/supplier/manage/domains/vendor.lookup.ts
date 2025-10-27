import {CoreQueryOptions, CoreResource} from "@app-global";
import {Vendor} from "./vendor.serializer";
import {VendorBranch} from "./vendor-branch.serializer";

export class VendorLookupQueryOptions extends CoreQueryOptions {
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

    public get isGoods(){ return "goods" == this.masterType; }
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
    action: string;
    valueType: string;
    formula: string;
    constructor(model: any = <any>{}){
        const { id, action, valueType, formula } = model;
        this.id = id;
        this.action = action;
        this.valueType = valueType;
        this.formula = formula;
    }
}
export class VendorProductBrandDivision {
    id: number;
    name: string;
    description: string;
    constructor(model: any = <any>{}){
        const { id, name, description } = model;
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
export class VendorProductBrand {
    id: number;
    name: string;
    divisions: Array<VendorProductBrandDivision>;
    constructor(model: any = <any>{}){
        const { id, name, divisions} = model;
        this.id = id;
        this.name = name;
        this.divisions = (divisions || []).map(r => new VendorProductBrandDivision(r));
    }
}

export class VendorLookup extends CoreResource {
    supplyNature: Array<SupplyNatureLookup>;
    supplyTypes: Array<SupplyTypeLookup>;

    purchaseTypes: Array<PurchaseTypeLookup>;
    calcTypes: Array<CalcTypeLookup>;
    brands: Array<VendorProductBrand>;

    constructor(model: any = <any>{}) {
        super();
        const {
            supplyTypes, supplyNature,
            purchaseTypes, calcTypes, brands
        } = model;
        this.supplyTypes = (supplyTypes || []).map(r => new SupplyTypeLookup(r));
        this.supplyNature = (supplyNature || []).map(r => new SupplyNatureLookup(r));

        this.purchaseTypes = (purchaseTypes || []).map(r => new PurchaseTypeLookup(r));
        this.calcTypes = (calcTypes || []).map(r => new CalcTypeLookup(r));
        this.brands = (brands || []).map(r => new VendorProductBrand(r));
    }

    getNatureById = (id) => (this.supplyNature || []).find(r => r.id == id);
    getBrandById = (id) => (this.brands || []).find(r => r.id == id);
}


export class VendorLookupSerializer
{
    fromJson(json: any): VendorLookup { return new VendorLookup(json); }
    toJson(data: any): any { return {}; }
}

export class VendorByIdLookup {
    id: string;
    name: string;
    code: string;
    contactNo: string;
    contactEmail: string;
    address: [''];
    city: [''];
    pinCode: [''];

    accountId: string;
    vendorId: string;

    account: string;
    vendor: Vendor;
    brands: Array<any>;
    branches: Array<VendorBranch>;

    public constructor(model){
        const {
            id, name, code, contactNo, contactEmail, address, city, pinCode,
            dateWiseBalance, accountId, vendorId, account, vendor, brands, branches
        } = model;
        this.id = id;
        this.name = name;
        this.code = code;
        this.contactNo = contactNo;
        this.contactEmail = contactEmail;
        this.address = address;
        this.city = city;
        this.pinCode = pinCode;
        this.accountId = accountId;
        this.vendorId = vendorId;
        //this.dateWiseBalance = dateWiseBalance;

        this.vendor = new Vendor(vendor);
        this.brands = (brands || []).map( r => r);
        this.branches = (branches || []).map( r => new VendorBranch(r));
    }
}

export class VendorByIdLookupSerializer {
    fromJson(json: any): VendorByIdLookup { return new VendorByIdLookup(json); }
    toJson(data: any): any { return {}; }
}
