import {CoreQueryOptions} from "@app-global";


export class MasterTypeQueryOptions extends CoreQueryOptions {
    constructor(model: any = {}){super(model);}

    override toQueryString (){
        const obj = {};
        return super.getParamByObject(obj);
    }
}
