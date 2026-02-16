import {CoreQueryOptions} from "@app-global";

export class InventoryQueryOptions extends CoreQueryOptions{
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {};
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class Inventory {
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

    constructor(model: any = <any>{}){
        const { id, voucherTypeId, voucherType, productName, date, remark, netQuantity, netAmount, quantityIn, quantityOut, balance, lastIn, lastOut } = model;
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
    }
}

export class InventorySerializer{
    fromJson(json: Inventory): Inventory { return new Inventory(json); }

    toJson(model: any): any {
        return model;
    }
}
