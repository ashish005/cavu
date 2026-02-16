import {CoreQueryOptions} from "@app-global";

export class InvoiceByProductQueryOptions extends CoreQueryOptions{
    startDate: string;
    endDate: string;

    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            fromDate: this.startDate,
            toDate: this.endDate
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class InvoiceByProduct {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        const {
            id, name
        } = model;
        this.id = id;
        this.name = name;
    }
}

export class InvoiceByProductSerializer{
    fromJson(json: InvoiceByProduct): InvoiceByProduct { return new InvoiceByProduct(json); }
    toJson(model: any): any { return model; }
}
