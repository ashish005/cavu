import {CoreQueryOptions, CoreResource} from "@app-global";
export class LedgerReportMonthlyQueryOptions extends CoreQueryOptions{
  startDate: string;
  endDate: string;
  accountId: number;
  constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            fromDate: this.startDate,
            toDate: this.endDate,
            accountId: this.accountId
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class LedgerReportMonthly extends CoreResource{
    name: string;
    month: number;
    year: number;
    accountId: string;

    credit: number;
    debit: number;
    balance: number;

    openingBalance: number;
    closingBalance: number;

  constructor(model: any = <any>{}){
    super();
    const {
        id, name, month, year,
        credit, debit, balance, openingBalance, closingBalance
    } = model;
    this.id = id;
    this.name = name;
    this.month = month;
    this.year = year;

    this.credit = credit;
    this.debit = debit;
    this.balance = balance;
    this.openingBalance = openingBalance;
    this.closingBalance = closingBalance;
  }
}


export class LedgerReportMonthlySerializer{
  fromJson(json: LedgerReportMonthly): LedgerReportMonthly { return new LedgerReportMonthly(json); }

  toJson(model: any): any { return {}; }
}
