
export class  DashboardBusinessSummary {
  id: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
  }
}

export class  DashboardBusinessSummarySerializer {
  fromJson(json: any): DashboardBusinessSummary {
    return new DashboardBusinessSummary(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
