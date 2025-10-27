import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {ContactLookup, ContactLookupSerializer} from "../domains/lookup.serializer";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService} from "@app-global";
import {LoginGrantComponent} from "../components";

@Injectable()
export class ContactAPIResolver extends OrgResourceService<ContactLookup> implements Resolve<any> {
  masterType: ContactLookup;
  sharedService: SharedService;
  constructor(public override injector: Injector) {
    super(injector, 'contact/lookup', new ContactLookupSerializer());
    this.sharedService = injector.get(SharedService);
  }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => { this.masterType = results.data; };
    const failure = (err: any) => {};
    const setup = super.read(super.apiVersion);
    return super.performRouteResolver(route.data, setup, success, failure);
  }

    showLoginGrantPopup(data: any, popupHeaderOption: any, cb, failureCb){
        const popupOptions = {
            header: popupHeaderOption || { text: `${data.name}`, desc: `${data.name}` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        data = data || null;
        const success = (resp: any) => {
            this.sharedService.destroy();
            cb(resp);
        };
        const failure = (e) => {
            this.sharedService.destroy();
            failureCb();
        };
        let modal$ = this.sharedService.showCustomPopup(LoginGrantComponent, popupOptions, data);
        modal$.then(success, failure);
    }
}
