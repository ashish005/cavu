import {CoreQueryOptions} from "@app-global";

export class BankAccountQueryOptions extends CoreQueryOptions {
    bankId: number;
    constructor(model: any = <any>{}){ super(); }
    toQueryString (){
        const obj = {
            bankId: this.bankId
        };
        return super.getParamByObject(obj);
    }
}

export class BankAccount {
    id: number;
    accountId: string;
    accountName: string;
    accountGroupName: string;
    bankAccountNo: string;
    bankName: string;
    branchAddress: string;
    branchName: string;
    ifscCode: string;
    micrCode: string;
    remark: string;

    isLocked: boolean;
    status: string;

    bankAmount: number;
    bookAmount: number;

    constructor(model: any = <any>{}){
        const { id, bankName, accountId, accountName, accountGroupName, bankAccountNo, branchAddress, branchName,
            ifscCode, micrCode, remark, bankAmount, bookAmount,
            isLocked, status } = model;
        this.id = id;
        this.accountId = accountId;
        this.accountName = accountName;
        this.accountGroupName = accountGroupName;
        this.bankAccountNo = bankAccountNo;
        this.bankName = bankName;

        this.branchAddress = branchAddress;
        this.branchName = branchName;

        this.ifscCode = ifscCode;
        this.micrCode = micrCode;
        this.remark = remark;

        this.isLocked = isLocked;
        this.status = status;

        this.bankAmount = bankAmount;
        this.bookAmount = bookAmount;
    }
}

export class BankAccountSerializer {
  fromJson(json: any): BankAccount { return new BankAccount(json); }

  toJson(data: any): any { return data; }
}

