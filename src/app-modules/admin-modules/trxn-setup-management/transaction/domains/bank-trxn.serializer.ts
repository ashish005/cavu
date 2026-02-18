import {CoreQueryOptions} from "@app-global";

export class BankTrxnQueryOptions extends CoreQueryOptions {
    status: string;
    constructor(model: any = <any>{}){ super(); }

    override toQueryString (){
        const obj = {
            status: this.status
        };
        return super.getParamByObject(obj);
    }
}

export class BankTrxn {
    id: number;
    date: string;
    refNo: string;
    trxnType: string;
    payee: string;
    withdrawls: string;
    deposits: string;

    constructor(model: any = <any>{}){
        const { id, date, refNo, trxnType, payee, deposits, withdrawls } = model;
        this.id = id;
        this.date = date;
        this.refNo = refNo;
        this.trxnType = trxnType;
        this.payee = payee;

        this.deposits = deposits;
        this.withdrawls = withdrawls;
    }
}

export class BankTrxnSerializer {
  fromJson(json: any): BankTrxn { return new BankTrxn(json); }
  toJson(data: any): any { return data; }
}

