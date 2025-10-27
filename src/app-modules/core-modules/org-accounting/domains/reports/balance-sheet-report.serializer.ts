import {CoreQueryOptions} from "@app-global";

export class BalanceSheetReportQueryOptions extends CoreQueryOptions{
    startDate: string;
    endDate: string;

    constructor(model: any = {}){ super(model); }

    override toQueryString (){
        const obj = {
            fromDate: this.startDate,
            toDate: this.endDate
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class BalanceSheetReport {
  id: string;
  head: string;
  accountNature: string;
  credit: number;
  debit: number;
  amount: number;
  isLiability: boolean;
  isHighPriority: boolean;
  isAsset: boolean;
  sortOrder: number;
  children: Array<BalanceSheetReport>;

  constructor(model: any = <any>{}){
    const { isLiability, isHighPriority, isAsset, sortOrder, amount, credit, debit, children } = model;
    this.id = model.id;
    this.head = model.head;
    this.accountNature = model.accountNature;
    this.credit = credit;
    this.debit = debit;
    this.amount = amount;

    this.isLiability = isLiability;
    this.isHighPriority = isHighPriority;
    this.isAsset = isAsset;
    this.sortOrder = sortOrder;
    this.children = (children || []).map(r => new BalanceSheetReport(r));
  }
}

export class BalanceSheetReportSerializer{
  fromJson(json: any): BalanceSheetReport { return new BalanceSheetReport(json); }
  toJson(data: any): any { return {}; }
}

export class BalanceSheetWrapper {
  highlist: Array<BalanceSheetReport>;
  lowlist: Array<BalanceSheetReport>;
  getHighTotal(){
    return this.highlist?.reduce((a, b) => a + b.amount, 0);
  }
    getLowTotal(){
        return this.lowlist?.reduce((a, b) => a + b.amount, 0);
    }

    getTotal(){
      return this.getHighTotal() + this.getLowTotal();
    }
}
