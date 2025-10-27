import {Injectable, Injector, OnDestroy} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, OrgResourceService, SharedService} from "@app-global"
import {DriverLookup, DriverLookupSerializer} from "../domains/lookup";
import {DriverCeComponent} from "../components/driver-ce.component";

@Injectable()
export class DriverAPIResolver extends OrgResourceService<DriverLookup> {
  masterType: DriverLookup;
  constructor(public override injector: Injector, private sharedService: SharedService) {
     super(injector, `driverLookup`, new DriverLookupSerializer());
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

    createEditDriver(inputData, popupHeader, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(DriverCeComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
