import {Injectable, Injector, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";
import  { OrgResourceService } from "@app-global";
import {WorkflowPluginLookup, WorkflowPluginLookupSerializer} from "../domains/lookup";

@Injectable()
export class WorkflowPluginAPIResolver extends OrgResourceService<WorkflowPluginLookup> {
  masterType: WorkflowPluginLookup;
  subscription : Subscription;
  constructor(public override injector: Injector) {
     super(injector, `pipelineLookup/workflow`, new WorkflowPluginLookupSerializer());
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
            return this.performRouteResolver({name: 'Workflow' }, setup, success, failure);
        });
        return promise;
    }
}
