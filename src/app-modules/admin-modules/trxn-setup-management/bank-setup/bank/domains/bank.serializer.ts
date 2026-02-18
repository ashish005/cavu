import {CoreQueryOptions} from "@app-global";

export class BankQueryOptions extends CoreQueryOptions {
    constructor(model: any = <any>{}){ super(); }
}

export class Bank {
    id: number;
    name: string;
    isLocked: boolean;
    status: string;

    constructor(model: any = <any>{}){
        const { id, name, isLocked, status } = model;
        this.id = id;
        this.name = name;
        this.isLocked = isLocked;
        this.status = status;
    }
}

export class BankSerializer {
  fromJson(json: any): Bank { return new Bank(json); }
  toJson(data: any): any { return data; }
}

