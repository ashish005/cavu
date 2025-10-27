
export class  DashboardEventCalendarSummary {
  id: string;

  constructor(model: any = <any>{}){
    this.id = model.id;
  }
}

export class  DashboardEventCalendarSummarySerializer {
  fromJson(json: any): DashboardEventCalendarSummary {
    return new DashboardEventCalendarSummary(json);
  }

  toJson(data: any): any {
    return {
      id: data.id,
      name: data.name
    };
  }
}
