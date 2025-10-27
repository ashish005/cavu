import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProductTokenQueryOptions extends CoreQueryOptions{
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

export class ProductTokenDetail {
    id: number;
    userId: string;
    distributeDate: string;
    distributeBy: string;
    returnedDate: string;
    returnedBy: string;
    validTillDate: string;
    isCancelled: boolean;

    constructor(model: any = <any>{}){
        const {id, userId, distributeDate, distributeBy, returnedDate, returnedBy, validTillDate, isCancelled } = model;
        this.id = id;
        this.userId = userId;
        this.distributeDate = distributeDate;
        this.distributeBy = distributeBy;
        this.returnedDate = returnedDate;
        this.returnedBy = returnedBy;
        this.validTillDate = validTillDate;
        this.isCancelled = isCancelled;
    }
}

export class ProductToken extends CoreResource {
    userId: string;
    productId: string;
    number: string;
    quantity: number;
    applicableFor: string;
    tokenTypeId: number;
    value: number;
    details: ProductTokenDetail;

    constructor(model: any = <any>{}){
        super();
        const {id, userId, productId, number, quantity, applicableFor, tokenTypeId, value, details } = model;
        this.id = id;
        this.userId = userId;
        this.productId = productId;
        this.number = number;
        this.quantity = quantity;
        this.applicableFor = applicableFor;
        this.tokenTypeId = tokenTypeId;
        this.value = value;
        this.details = new ProductTokenDetail(details);
    }
}

export class ProductTokenSerializer {
    fromJson(json: any): ProductToken {
        return new ProductToken(json);
    }
    toJson(model: any): any {
        const {id, name, shortName, description} = model;
        return model;
    }
}
