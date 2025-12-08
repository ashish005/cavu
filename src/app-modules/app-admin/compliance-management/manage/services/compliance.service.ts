import {Injectable, Injector} from "@angular/core";
import {Compliance, ComplianceSerializer} from "../domains/compliance.serializer";
import  { OrgResourceService } from "@app-global";
import {catchError, map, Observable} from "rxjs";
import { ComplianceDetail, ComplianceDetailSerializer} from "../domains/compliance-detail.serializer";
import {ComplianceTracker, ComplianceTrackerSerializer} from "../domains/compliance-tracker.serializer";

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

@Injectable()
export class ComplianceTrackerService extends OrgResourceService<ComplianceTracker>{
    constructor(public override injector: Injector) { super(injector, 'complianceTracker', new ComplianceTrackerSerializer()); }

    updateStatus(taskId: number, newStatusId: number): Observable<any> {
        return this.httpClient.patch(`${this.viewUrl}/${taskId}/status`, { complianceStatus: newStatusId }, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.updateStatus(taskId, newStatusId)))
            );
    }
}