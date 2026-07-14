import {CoreQueryOptions, CoreResource} from "@app-global";

export class ContactQueryOptions extends CoreQueryOptions
{
    projectId: string;
    accountId: string;
    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            projectId:this.projectId,
            accountId: this.accountId
        };
        return super.getParamByObject(obj);
    }
}

export class Contact extends CoreResource {
    override id: number;
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

export class ContactSerializer {
    fromJson(json: any): Contact { return new Contact(json); }
    toJson(model: any): any { return model; }
}

/*
export class RelationType {
    id: number;
    name: string;
    constructor(model: any = <any>{}){
        const { id, name } = model || {};
        this.id = id;
        this.name = name;
    }
}

export class ContactLookup {
    relationTypes: Array<RelationType>;

    constructor(model: any = <any>{}){
        const { relationTypes } = model || {};
        this.relationTypes = (relationTypes || []).map(r => new RelationType(r));
    }
}

export class ContactLookupSerializer {
    fromJson(json: any): ContactLookup {
        return new ContactLookup(json);
    }

    toJson(info: any): any {
        return {};
    }
}*/
