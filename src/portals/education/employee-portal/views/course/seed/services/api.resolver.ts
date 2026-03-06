import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {OrgResourceService} from "@app-global";
import {CourseLookup, CourseLookupSerializer} from "../domains/course.lookup";

@Injectable()
export class CourseSeederAPIResolver extends OrgResourceService<CourseLookup> implements Resolve<any> {
  masterType: CourseLookup;
  constructor(public override injector: Injector) {
    super(injector, `lookup/course-master-type`, new CourseLookupSerializer());
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }
}