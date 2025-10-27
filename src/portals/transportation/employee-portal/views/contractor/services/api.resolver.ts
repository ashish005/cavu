import {Injectable, Injector, OnDestroy} from "@angular/core";
import  { OrgResourceService } from "@app-global"
import {ContractorLookup, ContractorLookupSerializer} from "../domains/lookup";

@Injectable()
export class ContractorAPIResolver extends OrgResourceService<ContractorLookup> {
  masterType: ContractorLookup;
  constructor(public override injector: Injector) {
     super(injector, `VehicleLookup`, new ContractorLookupSerializer());
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
