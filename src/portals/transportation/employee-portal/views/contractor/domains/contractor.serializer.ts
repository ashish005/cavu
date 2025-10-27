import {CoreQueryOptions, CoreResource} from "@app-global";

export class ContractorQueryOptions extends CoreQueryOptions{
    code: string;

    constructor(data: any = {}){
        super(data);
        this.code = data.code;
    }

    override toQueryString (){
        const obj = {
            code:this.code
        };
        return super.getParamByObject(obj);
    }
}

export class Contractor extends CoreResource
{
    userId: string;
    name: string;
    email: string;
    phone: string;
    ownedVehicles: string;
    constructor(model: any = <any>{}){
        super();
        const { id, userId, name, email, phone, ownedVehicles } = model;
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.ownedVehicles = ownedVehicles;
    }
}

export class ContractorSerializer {
  fromJson(json: any): Contractor { return new Contractor(json); }
  toJson(model: any): any {return model;}
}
