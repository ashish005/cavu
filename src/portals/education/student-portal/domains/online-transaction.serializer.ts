import {CoreQueryOptions} from "@app-global";

export class OnlineTransactionQueryOptions extends CoreQueryOptions
{
    accountId: string;
    override toQueryString (){
        const obj = {
            accountId:this.accountId
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}


export class OnlineTransaction {
    id: string;
    name: string;

    constructor(model: any = <any>{}){
        this.id = model.id;
        this.name = model.name;
    }
}


export class OnlineTransactionSerializer {
    fromJson(json: any): OnlineTransaction {
        return new OnlineTransaction(json);
    }

    toJson(data: any): any {}
}