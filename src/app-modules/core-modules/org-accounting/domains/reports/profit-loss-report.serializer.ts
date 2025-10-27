import {CoreQueryOptions, CoreResource} from "@app-global";

export class ProfitLossReportQueryOptions extends CoreQueryOptions{
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

export class ProfitLossReport extends CoreResource{
  override id: number;
  accountGroupId: number;
  accountNature: string;
  head: string;
  amount: number;

  isExpense: boolean;
  isHighPriority: boolean;
  isIncome: boolean;
  sortOrder: number;
  constructor(model: any = <any>{}){
    super();
    const { id, accountGroupId, head, accountNature, amount, isExpense, isHighPriority, isIncome, sortOrder} = model;
    this.id = id;
    this.accountGroupId = accountGroupId;
    this.head = head;
    this.accountNature = accountNature;

    this.amount = amount;
    this.isExpense = isExpense;
    this.isHighPriority = isHighPriority;
    this.isIncome = isIncome;
    this.sortOrder = sortOrder;
  }
}


export class ProfitLossReportSerializer{
  fromJson(json: ProfitLossReport): ProfitLossReport { return new ProfitLossReport(json);  }

  toJson(model: any): any {
    return {};
  }
}

export class ProfitLossWrapper {
    highlist: Array<ProfitLossReport>;
    lowlist: Array<ProfitLossReport>;
    getHighTotal(){
        return this.highlist?.reduce((a, b) => a + (b.amount || 0), 0);
    }
    getLowTotal(){
        return this.lowlist?.reduce((a, b) => a + (b.amount || 0), 0);
    }

    getTotal(){ return this.getHighTotal() + this.getLowTotal(); }
}
