import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve} from "@angular/router";
import  { OrgResourceService } from "@app-global";
import {LogLookup, LogLookupSerializer} from "../domains/lookup.serializer";

@Injectable()
export class LogAPIResolver extends OrgResourceService<LogLookup> implements Resolve<any> {
  masterType: LogLookup;
  private listData: any = { title: 'Admin Portal', navList: [] };

  constructor(public injector: Injector) { super(injector, 'masterlookup/log', new LogLookupSerializer()); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results['data'];
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }
}
