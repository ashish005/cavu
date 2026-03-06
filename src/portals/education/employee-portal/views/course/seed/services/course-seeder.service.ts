import {Injectable, Injector} from '@angular/core';
import {OrgResourceService} from "@app-global";
import {catchError} from "rxjs/operators";
import {CourseSeed, CourseSeedSerializer} from "../domains/course-seed.serializer";
@Injectable()
export class CourseSeedService extends OrgResourceService<CourseSeed>{
  constructor(public override injector: Injector) {
    super(injector, 'seeder/course', new CourseSeedSerializer());
  }

  getCoursesByStreamKey(key: string){
    const endpointUrl = this.viewUrl+`/`+key;
    return this.httpClient.get(endpointUrl, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getCoursesByStreamKey(key));
      }));
  }

  updateCourseByKey(data: any, key: string){
    const endpointUrl = this.viewUrl+`/`+key;
    return this.httpClient.patch(endpointUrl, data, this.requestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.updateCourseByKey(data, key));
      }));
  }
}

