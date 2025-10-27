import {CoreQueryOptions, CoreResource} from "@app-global";
import {BookSummaryData} from "../book-summary-data";

export class TrialBalanceLedgerQueryOptions extends CoreQueryOptions{
  startDate: string;
  endDate: string;
  accountGroupId: number;
  constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            fromDate: this.startDate,
            toDate: this.endDate,
            accountGroupId: this.accountGroupId
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class TrialBalanceLedger extends CoreResource{
    head: string;
    accountId: string;
    accountGroupId: number;

    amount: number;
    credit: number;
    debit: number;
    openingBalance: number;
    closingBalance: number;
    sortOrder: number;

    accountGroupName: string;

  constructor(model: any = <any>{}){
    super();
    const { id, head, accountId, accountGroupId,
        credit, debit,
        amount,
        accountGroupName,
        openingBalance, closingBalance
    } = model;
    this.id = id;
    this.head = head;
    this.accountId = accountId;
    this.accountGroupId = accountGroupId;
    this.accountGroupName = accountGroupName;

    this.amount = amount;
    this.credit = credit;
    this.debit = debit;

    this.openingBalance = openingBalance;
    this.closingBalance = closingBalance;
  }
}


export class TrialBalanceLedgerSerializer{
  fromDataJson(json: BookSummaryData): BookSummaryData { return new BookSummaryData(json); }
  fromJson(json: TrialBalanceLedger): TrialBalanceLedger { return new TrialBalanceLedger(json); }

  toJson(model: any): any {
    return {};
  }
}
