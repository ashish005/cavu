import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {SessionLookup, SessionLookupSerializer} from "../domains/lookup.serializer";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import { OrgBatchCreateEditComponent, SessionCreateEditComponent} from "../components";

@Injectable()
export class SessionAPIResolver extends OrgResourceService<SessionLookup> implements Resolve<any> {
  masterType: SessionLookup;
  constructor(public override injector: Injector, private popupService: SharedService, public activatedRoute: ActivatedRoute) {
      super(injector, 'lookup/org-batch-session', new SessionLookupSerializer());
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

    addUpdateBatchPopup(inputData: any, headerOptions, cb){
        const popup = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };

        const success = (resp: any)=>{
            this.popupService.destroy();
            cb();
        };
        const failure = (e)=>{
            this.popupService.destroy();
        };

        let modal$ = this.popupService.showCustomPopup(OrgBatchCreateEditComponent, popup, inputData);
        modal$.then(success, failure);
    }

    addUpdateSessionPopup(inputData: any, header, cb){
        const popup = {
            header: header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.LARGE
        };

        const success = (resp: any)=>{
            this.popupService.destroy();
            cb(resp);
        };

        const failure = (e)=>{ this.popupService.destroy(); };

        let modal$ = this.popupService.showCustomPopup(SessionCreateEditComponent, popup, inputData);
        modal$.then(success, failure);
    }
}