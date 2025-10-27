import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {OrgUserLookup, OrgUserLookupSerializer} from "../domains/lookup.serializer";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import {LayoutCELayout} from "../layout/layout";

@Injectable()
export class OrgUserAPIResolver extends OrgResourceService<OrgUserLookup> implements Resolve<any> {
  masterType: OrgUserLookup;
  moduleCode: string;
  constructor(public override injector: Injector, private sharedService: SharedService) {
      super(injector, 'lookup/employee', new OrgUserLookupSerializer());
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

  arrayToObject = (array, keyField) => array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj
  }, {});

    showEmployeeCEPopup(inputData: any, popupHeaderOption: any, cb){
        const popup = {
            header: popupHeaderOption,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp)=> {
            this.sharedService.destroy();
            cb();
        };
        const error = (resp)=> {
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(LayoutCELayout, popup, inputData);
        modal$.then(success, error);
    }
}
