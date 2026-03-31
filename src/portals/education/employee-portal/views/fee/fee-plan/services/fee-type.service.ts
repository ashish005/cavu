import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {FeeType, FeeTypeSerializer} from "../domains/fee-type.serializer";
import {catchError, map, tap, throwError} from "rxjs";
import {FeeTax} from "../domains/fee-tax.serializer";

@Injectable()
export class FeeTypeService extends OrgResourceService<FeeType> {
  constructor(public override injector: Injector) { super(injector, 'feeType', new FeeTypeSerializer());}

    updateDueFeeStructure(feeTypeId, feePlanId, feeStructureId) {
        return this.httpClient
            .put(`${this.viewUrl}/applychange/${feeTypeId}/${feeStructureId}`, null, this.requestHeaders)
            .pipe(
                tap((resp: any) => resp),
                catchError(error => this.handleError(error, () => this.updateDueFeeStructure(feeTypeId, feePlanId, feeStructureId)))
            );
    }

    getFeeTypeTaxes(studyModeTypeId, studyLevelTypeId) {
        return this.httpClient
            .get(`${this.viewUrl}/taxes/${studyModeTypeId}/${studyLevelTypeId}`, this.requestHeaders)
            .pipe(
                map((resp: any) => (resp.entities || []).map(r => new FeeTax(r))),
                //tap((resp: any) => (resp.entities || []).map(r => new FeeTax(r))),
                catchError(error => this.handleError(error, () => this.getFeeTypeTaxes(studyLevelTypeId, studyModeTypeId)))
            );
    }

    updateFeeTypeTaxes(studyModeTypeId, studyLevelTypeId, payload) {
        return this.httpClient
            .post(`${this.viewUrl}/taxes/${studyModeTypeId}/${studyLevelTypeId}`, payload, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.getFeeTypeTaxes(studyLevelTypeId, studyModeTypeId)))
            );
    }
}
