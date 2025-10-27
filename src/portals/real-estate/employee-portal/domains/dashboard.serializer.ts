import {CoreQueryOptions} from "@app-global";

export class ReDashboardQueryOptions extends CoreQueryOptions{
  orgUnitId: string;
  branchId: string;
  orgUserId: string;
  sessionId: number;
  portletId:number;
  trxnDateFrom: Date;
  trxnDateTo: Date;
  durationType: string;
  viewType: string;

  sortBy: string;
  sortDirection: string;

  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {
      orgUnitId: this.orgUnitId,
      branchId:this.branchId,
      orgUserId: this.orgUserId,
      sessionId:this.sessionId,
      portletId:this.portletId,
      trxnDateFrom:this.trxnDateFrom,
      trxnDateTo:this.trxnDateTo,
      viewType:this.viewType,
      durationType: this.durationType,
      sortBy:this.sortBy,
      sortDirection:this.sortDirection
    };
    const params = super.getParamByObject(obj);
    return params;
  }
}

