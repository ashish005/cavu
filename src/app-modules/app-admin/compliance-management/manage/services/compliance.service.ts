import {Injectable, Injector} from "@angular/core";
import {Compliance, ComplianceSerializer} from "../domains/compliance.serializer";
import  { OrgResourceService } from "@app-global";
import {catchError, map} from "rxjs";
import { ComplianceDetail, ComplianceDetailSerializer} from "../domains/compliance-detail.serializer";

@Injectable()
export class ComplianceService extends OrgResourceService<Compliance>{
    constructor(public override injector: Injector) { super(injector, 'compliance', new ComplianceSerializer()); }

    updateScheduleCompliance(id, schedule: any) {
        return this.httpClient.post(`${this.viewUrl}/${id}/schedule-details`, schedule, this.requestHeaders)
            .pipe(
                map((resp: any) => resp),
                catchError(error => this.handleError(error, () => this.updateScheduleCompliance(id, schedule)))
            );
    }

    testScheduler(schedule: any){
        return this.httpClient.post(`${this.viewUrl}/schedule/test`, schedule, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.testScheduler(schedule)))
            );
    }
}

@Injectable()
export class ComplianceDetailService extends OrgResourceService<ComplianceDetail>{
    constructor(public override injector: Injector) { super(injector, 'complianceDetail', new ComplianceDetailSerializer()); }
}
