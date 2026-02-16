import {CoreQueryOptions, CoreResource} from "@app-global";

export class TrialBalanceQueryOptions extends CoreQueryOptions{
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

export class TrialBalance extends CoreResource{
    name: string;
    accountId: string;
    accountGroupId: number;

    amount: number;
    credit: number;
    debit: number;
    openingBalance: number;
    closingBalance: number;

    isAsset: boolean;
    isExpense: boolean;
    isHighPriority: boolean;
    isIncome: boolean;
    isLedgerWise: boolean;
    isLiability: boolean;

    sortOrder: number;
    children: Array<TrialBalance>;

    accountGroupName: string;

  constructor(model: any = <any>{}){
    super();
    const { id, name, accountId, accountGroupId,
        credit, debit,
        amount,
        accountGroupName,
        openingBalance, closingBalance,
        isAsset, isHighPriority, isExpense, isIncome, isLedgerWise, isLiability,
        children
    } = model;
    this.id = id;
    this.name = name;
    this.accountId = accountId;
    this.accountGroupId = accountGroupId;
    this.accountGroupName = accountGroupName;

    this.amount = amount;
    this.credit = credit;
    this.debit = debit;

    this.openingBalance = openingBalance;
    this.closingBalance = closingBalance;

    this.isAsset = isAsset;
    this.isHighPriority = isHighPriority;
    this.isIncome = isIncome;
    this.isExpense = isExpense;
    this.isLedgerWise = isLedgerWise;
    this.isLiability = isLiability;
    this.children = (children || []).map(r => new TrialBalance(r));
  }
}


export class TrialBalanceSerializer{
  fromJson(json: TrialBalance): TrialBalance { return new TrialBalance(json); }

  toJson(model: any): any {
    return {};
  }
}
