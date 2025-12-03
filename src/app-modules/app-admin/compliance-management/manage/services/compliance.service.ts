import {Injectable, Injector} from "@angular/core";
import {Compliance, ComplianceDetail, ComplianceSerializer} from "../domains/compliance.serializer";
import  { OrgResourceService } from "@app-global";
import {catchError, map} from "rxjs";

@Injectable()
export class ComplianceService extends OrgResourceService<Compliance>{
    constructor(public override injector: Injector) { super(injector, 'compliance', new ComplianceSerializer()); }
    getComplianceSchedules(id, schedule: any) {
        return this.httpClient.post(`${this.viewUrl}/${id}/schedule/details`, schedule, this.requestHeaders)
            .pipe(
                map((resp: any) => new ComplianceDetail(resp.entities)),
                catchError(error => this.handleError(error, () => this.getComplianceSchedules(id, schedule)))
            );
    }
    testScheduler(schedule: any){
        return this.httpClient.post(`${this.viewUrl}/schedule/test`, schedule, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.testScheduler(schedule)))
            );
    }
}
