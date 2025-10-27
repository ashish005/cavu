import {CoreQueryOptions, CoreResource} from "@app-global";

export class AssociateQueryOptions extends CoreQueryOptions
{
    orgUserId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}

export class Associate extends CoreResource {
    title: string;
    fName: string;
    lName: string;
    phone: string;
    email: string;
    accountId: string;
    relationTypeId: number;
    relationType: string;
    relationName: string;
    userId: string;
    hasLoginEnabled: boolean;
    isPrimary: boolean;

    name: string;

    constructor(model: any = <any>{}){
        super();
        const { id, title, fName, lName, phone, email, accountId, hasLoginEnabled, relationTypeId, relationType, relationName, userId, isPrimary } = model;
        this.id = id;
        this.title = title;
        this.fName = fName;
        this.lName = lName;
        this.phone = phone;
        this.isPrimary = isPrimary;
        this.email = email;
        this.accountId = accountId;
        this.relationTypeId = relationTypeId;
        this.relationType = relationType;
        this.relationName = relationName;
        this.userId = userId;
        this.hasLoginEnabled = hasLoginEnabled;
        this.name = `${fName} ${lName}`;
    }
}

export class AssociateSerializer {
    fromJson(json: any): Associate { return new Associate(json); }
    toJson(model: any): any { return model; }
}
