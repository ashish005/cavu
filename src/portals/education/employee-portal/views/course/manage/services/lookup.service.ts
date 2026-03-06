import {Injectable, Injector} from "@angular/core";
import {CourseLookup, CourseLookupSerializer} from "../domains/course.lookup";
import {OrgResourceService } from "@app-global";
import {map, tap} from "rxjs";

@Injectable()
export class CourseLookupService extends OrgResourceService<CourseLookup>{
  constructor(public override injector: Injector) { super(injector, 'lookup/course-master-type', new CourseLookupSerializer()); }

  getCourseByStudylevelId(studylevelId, studyLevelParentId){
      return this.httpClient
          .get(`${this.baseSectorAPIUrl}lookup/course/${studylevelId}/${studyLevelParentId || 0}/count`, this.requestHeaders)
          .pipe(
              map((resp: {  data: any}) => resp.data),
              tap((error)=>{ this.handleError(error, () => this.getCourseByStudylevelId(studylevelId, studyLevelParentId)) })
          );
  }

  /*byCountry(countryId){
    return this.httpClient
      .get(`${this.configService.baseApiUrl}lookup/course-master-type-by-country/${countryId}`, this.requestHeaders)
      .pipe(
        map((resp: {  data: any}) => resp.data),
        tap(
          (error)=>{ this.handleError(error, () => this.byCountry(countryId)) }
        )
      );
  }*/
}
