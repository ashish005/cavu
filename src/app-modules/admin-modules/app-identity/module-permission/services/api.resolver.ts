import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ASIDE_CLASS, ASIDE_SIZE, SharedService, CoreResourceService } from "@app-global";
import {UserManagementLookup, UserManagementLookupSerializer} from "../domains/user-management.lookup";
import {RolePermissionManager} from "../components/role-permission-manager";
import {LoginGrantComponent} from "../components/contact";

@Injectable()
export class UserManagementAPIResolver extends CoreResourceService<UserManagementLookup> implements Resolve<any>  {
    masterType: UserManagementLookup;
    sharedService: SharedService;
    constructor(public override injector: Injector) {
        super(injector, 'authLookup', new UserManagementLookupSerializer());
        this.sharedService = injector.get(SharedService);
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.readLookup(`${this.apiVersion}`);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    showMyPermission(inputData: any, popupHeaderOptions: any) {
        const popup = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        const success = (resp: any) => {
            this.sharedService.destroy();
        };
        const failure = (e) => {
            this.sharedService.destroy();
        };
        let modal$ = this.sharedService.showCustomPopup(RolePermissionManager, popup, inputData);
        modal$.then(success, failure);
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
