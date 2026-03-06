import {Observable, throwError} from "rxjs";
import {FeeByStudentBatch, FeeByStudentBatchSerializer} from "../domains/fee-by-student-batch.serializer";
import {Injectable, Injector} from "@angular/core";
import {map, tap} from "rxjs";
import {OrgResourceService} from "@app-global";

@Injectable()
export class FeeByStudentBatchService extends OrgResourceService<FeeByStudentBatch>{
  constructor(public override injector: Injector) { super(injector, 'fee/student', new FeeByStudentBatchSerializer()); }

    syncBatchFee(data){
        return this.httpClient.post<any>(`${this.baseSectorAPIUrl}studentBatch/sync`, data, this.requestHeaders)
            .pipe(
                map((resp: any) => resp),
                tap(
                    (error) => {
                        this.handleError(error, () => this.syncBatchFee(data))
                    }
                )
            );
    }
}
