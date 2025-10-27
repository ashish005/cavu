import {CoreQueryOptions, CoreResource} from "@app-global";

export class RecurringInvoiceQueryOptions extends CoreQueryOptions{
    projectId: string;
    accountId: string;
    moduleId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            accountId:this.accountId,
            moduleId: this.moduleId,
            invoiceMasterType: 'invoice'
        };
        return super.getParamByObject(obj);
    }
}

export class RecurringInvoice extends CoreResource {
    name: string;

    constructor(model: any = <any>{}){
        const {id, name} = model;
        super();
        this.id = model.id;
        this.name = model.name;
    }
}

export class RecurringInvoiceSerializer {
    fromJson(json: any): RecurringInvoice { return new RecurringInvoice(json); }
    toJson(project: any): any {
        return {
            name: project.name
        };
    }
}
