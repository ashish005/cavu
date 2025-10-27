import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {UserManagementLookup, UserManagementLookupSerializer} from "../domains/user-management.lookup";
import {RolePermissionManager} from "../components/role-permission-manager";

@Injectable()
export class UserManagementAPIResolver extends OrgResourceService<UserManagementLookup> implements Resolve<any>  {
    masterType: UserManagementLookup;
    sharedService: SharedService;
    constructor(public override injector: Injector) {
        super(injector, 'org-lookup/auth', new UserManagementLookupSerializer());
        this.sharedService = injector.get(SharedService);
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(`${this.apiVersion}/employee`);
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
}
