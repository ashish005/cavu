import {EventEmitter, Injectable, Injector, OnDestroy} from "@angular/core";
import {forkJoin, of, Subject} from "rxjs";
import {Subscription} from "rxjs";
import {CoreSectorResourceService} from "../../../../core-setup/index";
import {EventTaskPluginLookup, EventTaskPluginLookupSerializer} from "../domains/lookup";

@Injectable()
export class EventTaskPluginResolver extends CoreSectorResourceService<EventTaskPluginLookup> {
  masterType: EventTaskPluginLookup;
  lookupChange: EventEmitter<any> = new EventEmitter<any>();
    constructor(public injector: Injector) {
        super(injector, `pipelineLookup/event-task`, new EventTaskPluginLookupSerializer());
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
            const setup = this.read(this.coreService.apiVersion);
            return this.coreService.performRouteResolver({name: 'EventTask' }, setup, success, failure);
        });
        return promise;
    }
}