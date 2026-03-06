import {map, tap} from "rxjs";
import  { OrgResourceService } from "@app-global";
import {CourseLookup, CourseLookupSerializer} from "../domain/course.lookup";
import {Injectable, Injector} from "@angular/core";

@Injectable()
export class CourseLookupService extends OrgResourceService<CourseLookup>{
    masterType: CourseLookup;
    constructor(public override injector: Injector) { super(injector, 'lookup/course-master-type', new CourseLookupSerializer()); }

    getCourseByStudylevelId(studylevelId, studyLevelParentId){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}lookup/course/${studylevelId}/${studyLevelParentId || 0}/count`, this.requestHeaders)
            .pipe(
                map((resp: {  data: any}) => resp.data),
                tap((error)=>{ this.handleError(error, () => this.getCourseByStudylevelId(studylevelId, studyLevelParentId)) })
            );
    }
    resolve() {
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
            return this.performRouteResolver({ name: 'Course' }, setup, success, failure);
        });
        return promise;
    }
}