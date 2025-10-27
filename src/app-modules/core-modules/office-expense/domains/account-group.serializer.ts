import {CoreQueryOptions, CoreResource} from "@app-global";

export class AccountGroupQueryOptions extends CoreQueryOptions{
  accountId: string;
  fromDate: string;
  toDate: string;

  constructor(){ super(); }

  override toQueryString (){
    const obj =
    {
        nature: 'expenses'
    };
    return super.getParamByObject(obj);
  }
}

export class AccountGroup extends CoreResource
{
    head: string;
    accountCount: number;
    accountId: string;
    accountGroup: string;
    accountGroupId: number;
    accountNature: string;
    amount: number;
    credit: number;
    debit: number;

    isAsset: boolean;
    isExpense: boolean;
    isHighPriority: boolean;
    isIncome: boolean;
    isLedgerWise: boolean;
    isLiability: boolean;
    openingBalance: number;
    closingBalance: number;
    sortOrder: number;
    children: Array<AccountGroup>;

    constructor(model: any = <any>{}){
        super();
        const { id, head, accountCount, accountNature, accountId,
            amount, credit, debit, accountGroup, accountGroupId,
            openingBalance, closingBalance,
            isAsset, isHighPriority, isExpense, isIncome, isLedgerWise, isLiability, children
        } = model;
        this.id = id;
        this.head = head;
        this.accountId = accountId;
        this.accountGroup = accountGroup;
        this.accountCount = accountCount;
        this.accountNature = accountNature;
        this.accountGroupId = accountGroupId;
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
        this.children = (children || []).map(r => new AccountGroup(r));
    }

    isGroupLedgerWise(){
        return (this.accountCount>0 && !this.children.length);
    }
}

export class AccountGroupSerializer
{
  fromJson(json: any): AccountGroup {
    return new AccountGroup(json);
  }

  toJson(data: any): any {
    return data;
  }
}
