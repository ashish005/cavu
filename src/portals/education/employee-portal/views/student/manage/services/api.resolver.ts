import {Injectable, Injector, OnDestroy} from "@angular/core";
import {Observable, Subject, Subscription, of, map, tap, catchError} from "rxjs";
import {FeeLookup, FeeLookupSerializer} from "../domains/fee.lookup";
import {ByOrgBatchLookup, ByOrgBatchLookupSerializer} from "../domains/org-batch.lookup";
import {OrgResourceService} from "@app-global";

@Injectable({ providedIn: 'root'})
export class StudentBatchLookupService extends OrgResourceService<FeeLookup> implements OnDestroy {
    masterType: FeeLookup;
    constructor(public override injector: Injector) { super(injector, 'feeLookup/student', new FeeLookupSerializer()); }

    private resolve() {
        const promise = new Promise((resolve, reject) => {
            if(this.masterType)
            {
                return resolve(true);
            }
            const success = (results) => {
                this.masterType = results['data'];
                return resolve(true);
            };
            const failure = (err: any) => { return reject(err); };
            const setup = this.read(this.apiVersion);
            return this.performRouteResolver({ name: 'Fee' }, setup, success, failure);
        });
        return promise;
    }

    ngOnDestroy(){}
}

@Injectable()
export class StudentOrgBatchLookupService extends OrgResourceService<ByOrgBatchLookup> {
    masterType: ByOrgBatchLookup;
    constructor(public override injector: Injector) { super(injector, 'feeLookup/orgBatch', new ByOrgBatchLookupSerializer()); }

    fetch(orgBatchId) {
        const promise = new Promise((resolve, reject) => {
            const success = (results) => {
                this.masterType = results['data'];
                return resolve(true);
            };
            const failure = (err: any) => { return reject(err); };
            const setup = this.read(orgBatchId);
            return this.performRouteResolver({ name: 'Org Batch' }, setup, success, failure);
        });
        return promise;
    }

    getFeePlans(sessionId, studyModeId, courseId, sectionId){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}orgBatch/feePlans/${sessionId}/${studyModeId}/${courseId}/${sectionId}`, this.requestHeaders)
            .pipe(
                map((resp: any) => (resp.entities || [])),
                catchError(error=> this.handleError(error, () => this.getFeePlans(sessionId, studyModeId, courseId, sectionId)))
            );
    }
}