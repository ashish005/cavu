export class  DashboardMonthlyProfit {
  id: string;
  portletId: number;

  duration: string;
  income: number;
  expense: number;
  profit: number;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.portletId = model.portletId;

    this.duration = model.duration;
    this.income = model.income;
    this.expense = model.expense;
    this.profit = model.profit;
  }
}

export class  DashboardMonthlyProfitSerializer {
  fromJson(json: any): DashboardMonthlyProfit {
    return new DashboardMonthlyProfit(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
