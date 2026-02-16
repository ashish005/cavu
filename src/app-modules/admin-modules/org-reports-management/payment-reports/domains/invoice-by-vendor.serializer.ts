import {CoreQueryOptions} from "@app-global";

export class InvoiceByVendorQueryOptions extends CoreQueryOptions{
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

export class InvoiceByVendor {
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

export class InvoiceByVendorSerializer{
    fromJson(json: InvoiceByVendor): InvoiceByVendor { return new InvoiceByVendor(json); }
    toJson(model: any): any { return model; }
}
