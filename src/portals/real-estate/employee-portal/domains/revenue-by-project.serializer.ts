export class  DashboardRevenueByProject {
  id: string;
    expense: string;
    name: string;
    revenue: string;
    startDate: string;

  constructor(model: any = <any>{}){
    const {id, name, expense, revenue, startDate } = model;
    this.id = id;
    this.name = name;
    this.expense = expense;
    this.revenue = revenue;
    this.startDate = startDate;
  }
}

export class DashboardRevenueByProjectSerializer {
  fromJson(json: any): DashboardRevenueByProject {
    return new DashboardRevenueByProject(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
