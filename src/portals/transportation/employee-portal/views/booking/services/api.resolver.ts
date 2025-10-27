import {Injectable, Injector, OnDestroy} from "@angular/core";
import  { OrgResourceService } from "@app-global"
import {TrackerLookup, TrackerLookupSerializer} from "../domains/lookup";

@Injectable()
export class TrackerAPIResolver extends OrgResourceService<TrackerLookup> {
  masterType: TrackerLookup;
  constructor(public override injector: Injector) {
     super(injector, `trackerLookup`, new TrackerLookupSerializer());
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
            return this.performRouteResolver({name: 'Driver' }, setup, success, failure);
        });
        return promise;
    }
}
