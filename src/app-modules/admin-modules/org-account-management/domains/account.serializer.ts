import {CoreQueryOptions} from "@app-global";

export class AccountQueryOptions extends CoreQueryOptions{
    accountGroupId: string;

    constructor(model: any = {}){
        super(model);
        this.accountGroupId = model.accountGroupId || '';
    }

   override toQueryString (){
        const obj = {
            accountGroupId:this.accountGroupId
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class Account {
  id: string;
  name: string;
  printName: string;
  accountGroupId: number;

  openingBalance: number;
  openingBalanceDate: string;

  creditDaysSale: number;
  creditDaysPurchase: number;
  creditLimit: number;

  billByBill: boolean;

  currentYearBalance: number;
  previousYearBalance: number;
  currentQtrBalance: number;
  previousQtrBalance: number;

  credit: number;
  debit: number;
  balance: number;
  closingBalance: number;
  accountGroupName: string;
  isLocked: boolean;

  constructor(model: any = <any>{}){
      const {
          id, name, printName, accountGroupId,
          openingBalance, openingBalanceDate,
          creditDaysSale, creditDaysPurchase, creditLimit, billByBill,
          currentYearBalance, previousYearBalance, currentQtrBalance, previousQtrBalance,
          credit, debit, balance, closingBalance, accountGroupName,
          isLocked
      } = model;
    this.id = id;
    this.name = name;
    this.printName = printName;
    this.accountGroupId = accountGroupId;

    this.openingBalance = openingBalance;
    this.openingBalanceDate = openingBalanceDate;

    this.creditDaysSale = creditDaysSale;
    this.creditDaysPurchase = creditDaysPurchase;
    this.creditLimit = creditLimit;
    this.billByBill = billByBill;

      this.currentYearBalance = currentYearBalance;
      this.previousYearBalance = previousYearBalance;
      this.currentQtrBalance = currentQtrBalance;
      this.previousQtrBalance = previousQtrBalance;

    this.credit = credit;
    this.debit = debit;
    this.balance = balance;

    this.isLocked = isLocked || false;
    this.closingBalance = closingBalance;
    this.accountGroupName = accountGroupName;
  }
}

export class AccountSerializer{
  fromJson(json: Account): Account {
    return new Account(json);
  }

  toJson(model: any): any {
    return model;
  }
}
