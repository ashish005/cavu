import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {EmployeeSalaryLookup, EmployeeSalaryLookupSerializer} from "../domains/lookup.serializer";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class EmployeeSalaryAPIResolver extends OrgResourceService<EmployeeSalaryLookup> implements Resolve<any> {
  masterType: EmployeeSalaryLookup;

  constructor(override injector: Injector) { super(injector, 'lookup/employee-salary', new EmployeeSalaryLookupSerializer()); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };

    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }
}
