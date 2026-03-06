import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {FeeType, FeeTypeSerializer} from "../domains/fee-type.serializer";
import {catchError, tap, throwError} from "rxjs";

@Injectable()
export class FeeTypeService extends OrgResourceService<FeeType> {
  constructor(public override injector: Injector) { super(injector, 'feeType', new FeeTypeSerializer());}

    updateDueFeeStructure(feeTypeId, feePlanId, feeStructureId) {
        return this.httpClient
            .put(`${this.viewUrl}/applychange/${feeTypeId}/${feeStructureId}`, null, this.requestHeaders)
            .pipe(
                tap((resp: any) => console.log('read logged')),
                catchError((error) => { return throwError(error); })
            );
    }
}
