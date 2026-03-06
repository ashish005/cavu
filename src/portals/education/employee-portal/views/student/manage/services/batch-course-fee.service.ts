import {Injectable, Injector} from "@angular/core";
import {BatchCourseFee, BatchCourseFeeSerializer} from "../domains/batch-course-fee.serializer";
import {map, tap} from "rxjs";
import {OrgResourceService} from "@app-global";

@Injectable()
export class BatchCourseFeeService extends OrgResourceService<BatchCourseFee> {
    constructor(public override injector: Injector) { super(injector, 'studentBatch', new BatchCourseFeeSerializer()); }

    syncBatchFee(data){
        return this.httpClient.post<any>(`${this.viewUrl}/sync`, data, this.requestHeaders)
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

