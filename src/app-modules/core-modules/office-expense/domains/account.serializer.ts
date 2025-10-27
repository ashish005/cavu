import {CoreQueryOptions} from "@app-global";

export class AccountQueryOptions extends CoreQueryOptions{
    accountGroupId: string;

    constructor(model: any = {}){
        super(model);
        this.accountGroupId = model.accountGroupId || '';
    }

    override toQueryString (){
        const obj = {
            accountGroupId:this.accountGroupId,
            nature: 'expenses'
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class Account {
    id: any;
    accountGroupId: string;
    accountGroupName: string;
    accountId: string;
    closingBalance: number;
    credit: number;
    debit: number;
    name: string;
    isLedgerWise: boolean;
    openingBalance: number;

  constructor(model: any = <any>{}){
      const { id, accountGroupId, accountGroupName, accountId, closingBalance,  credit,  debit, name, isLedgerWise, openingBalance } = model;
      this.id = id;
      this.accountGroupId = accountGroupId;
      this.accountGroupName = accountGroupName;
      this.accountId = accountId;
      this.closingBalance = closingBalance;
      this.credit = credit;
      this.debit = debit;
      this.name = name;
      this.isLedgerWise = isLedgerWise;
      this.openingBalance = openingBalance;
  }
}

export class AccountSerializer{
  fromJson(json: Account): Account {
    return new Account(json);
  }

  toJson(model: any): any {
    return {
      name: model.name,
      printName: model.printName,
      accountGroupId: model.accountGroupId,
      businessId: model.businessId,
      openingBalance: model.openingBalance,
      openingBalanceDate: model.openingBalanceDate,
      creditDaysSale: model.creditDaysSale,
      creditDaysPurchase: model.creditDaysPurchase,
      billByBill: model.billByBill,
      creditLimit: model.creditLimit
    };
  }
}
