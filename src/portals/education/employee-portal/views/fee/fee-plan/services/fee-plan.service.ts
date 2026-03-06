import {Injectable, Injector} from "@angular/core";
import {catchError, map, tap} from "rxjs/operators";
import {FeePlan, FeePlanSerializer} from "../domains/fee-plan.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class FeePlanService extends OrgResourceService<FeePlan>{
  constructor(public override injector: Injector) { super(injector, 'feePlan', new FeePlanSerializer()); }

  updateFeeStructure(feeplanId, feePlan){
    return this.httpClient
      .put(`${this.viewUrl}/structure/${feeplanId}`, feePlan, this.requestHeaders)
      .pipe(
          catchError(error=> this.handleError(error, () => this.updateFeeStructure(feeplanId, feePlan)))
      );
  }
    public updateFeeTypeScheduler(feeTypeId, schedulerData) {
        return this.httpClient
            .post(`${this.baseSectorAPIUrl}feeType/${feeTypeId}/scheduler`, schedulerData, this.requestHeaders)
            .pipe(
                catchError(
                    error => this.handleError(error, () => this.updateFeeTypeScheduler(feeTypeId, schedulerData))
                )
            );
    }

    public testPlanScheduler(feeStructure) {
        return this.httpClient
            .post(`${this.viewUrl}/test`, feeStructure, this.requestHeaders)
            .pipe(
                catchError(
                    error => this.handleError(error, () => this.testPlanScheduler(feeStructure))
                )
            );
    }
}