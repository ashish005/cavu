import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProductTransactionQueryOptions extends CoreQueryOptions
{
    productId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
          productId: this.productId
        };
        return super.getParamByObject(obj);
    }
}

export class ProductTransaction extends CoreResource {
    netAmount: string;
    netQuantity: string;

    date: string;
    lastIn: string;
    lastOut: string;

    productName: string;
    quantityIn: string;
    quantityOut: string;

    voucherType: string;
    voucherTypeId: number;

    constructor(model: any = <any>{}){
        super();
        const { id,
            netQuantity, netAmount,
            date, lastIn, lastOut,
            productName, quantityIn, quantityOut, voucherType, voucherTypeId
        } = model;
        this.id = id;
        this.netQuantity = netQuantity;
        this.netAmount = netAmount;
        this.date = date;
        this.lastIn = lastIn;
        this.lastOut = lastOut;
        this.productName = productName;
        this.quantityIn = quantityIn;
        this.quantityOut = quantityOut;
        this.voucherType = voucherType;
        this.voucherTypeId = voucherTypeId;
    }
}

export class ProductTransactionSerializer {
    fromJson(json: any): ProductTransaction { return new ProductTransaction(json); }
    toJson(model: any): any {
        return model;
    }
}
