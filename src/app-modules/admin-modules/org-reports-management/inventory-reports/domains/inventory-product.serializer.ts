import {CoreQueryOptions} from "@app-global";

export class InventoryProductQueryOptions extends CoreQueryOptions{
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {};
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class InventoryProduct {
    id: string;
    voucherTypeId: number;
    voucherType: number;
    productName: string;
    date: string;
    remark: string;

    netQuantity: number;
    netAmount: number;
    quantityIn: number;
    quantityOut: number;

    lastIn: number;
    lastOut: number;
    balance: number;

    mrp: number;
    supplyPrice: number;

    constructor(model: any = <any>{}){
        const { id, voucherTypeId, voucherType, productName, date, remark, netQuantity, netAmount, quantityIn, quantityOut, balance, lastIn, lastOut, mrp, supplyPrice } = model;
        this.id = id;
        this.voucherTypeId = voucherTypeId;
        this.voucherType = voucherType;
        this.productName = productName;
        this.date = date;
        this.remark = remark;
        this.netQuantity = netQuantity;
        this.netAmount = netAmount;
        this.quantityIn = quantityIn;
        this.quantityOut = quantityOut;
        this.balance = balance;
        this.lastIn = lastIn;
        this.lastOut = lastOut;

        this.mrp = mrp;
        this.supplyPrice = supplyPrice;
    }
}


export class InventoryProductPriceQueryOptions extends CoreQueryOptions{
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {};
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class InventoryProductPrice extends InventoryProduct {
    constructor(model: any = <any>{}){
        super(model);
    }
}

export class InventoryProductSerializer{
    fromJson(json: InventoryProduct): InventoryProduct { return new InventoryProduct(json); }
    toJson(model: any): any { return model; }
}

export class InventoryProductPriceSerializer{
    fromJson(json: InventoryProductPrice): InventoryProductPrice { return new InventoryProductPrice(json); }
    toJson(model: any): any { return model; }
}
