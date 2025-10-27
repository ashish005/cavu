import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {BusinessLookup, BusinessLookupSerializer} from "../domains/lookup.serializer";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, CoreEndpointBase} from "@app-global";
import {CreateEditBusinessView} from "../components";

@Injectable()
export class BusinessAPIResolver extends CoreEndpointBase implements Resolve<any> {
  masterType: BusinessLookup;
  constructor(public override injector: Injector, public sharedService: SharedService) { super(injector); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
        this.masterType = new BusinessLookup(results.data);
    };
    const failure = (err: any) => {};
      const setup = this.httpClient.get(
        this.baseAPIUrl + `/orgLookup/business-setup`,
        this.requestHeaders
      );
    //const setup = this.read(this.coreService.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

    showBusinessCEPopup(inputData: any, popupHeader: any, cb){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp) => {
            this.sharedService.destroy();
            cb();
        };
        const failure = (err) => {
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(CreateEditBusinessView, popup, inputData);
        modal$.then(success, failure);
    }
}
