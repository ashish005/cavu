import {Injectable, Injector} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {BehaviorSubject, map, Observable, of, Subject, throwError} from 'rxjs';

import {JwtHelper, UtilHelper, LoaderService, LocalStoreManager, DBkeys} from "@app-global";

import { LanguageMapper, ModulePermissionValues } from "./domains";
import {environment} from "@app-environments";
import {LoginUser} from "../../../app/third-party/identity/models/user.model";

class CoreServiceExtension {
  public readonly apiVersion: string = '1.0.2';
  public readonly appVersion: string = '3.1.0';

  public showThemeSetting: boolean = false;
  public showGlobalFilter: boolean = false;

  public toggleThemeSwitcher() { this.showThemeSetting = !this.showThemeSetting; }
  public toggleGlobalFilter() { this.showGlobalFilter = !this.showGlobalFilter; }

  public reLoginDelegate: { (): void } | undefined;
  public showGlobalFilterPopup: { (): void } | undefined;

  public showBellPopup: { (): void } | undefined;
  public createSupportTicket: { (): void } | undefined;
  public showSurveyPopup: { (): void } | undefined;
}

@Injectable({ providedIn: 'root' })
export class CoreService extends CoreServiceExtension {
    // public getActiveBranch = () => !this.isRootUser && this.orgSetup.getActiveBranchById(this.getOrgBranchId());
    // public isOriginalDomain =()=> UtilHelper.isOriginalDomain();

    protected localStorage: LocalStoreManager;
    constructor(private injector: Injector, protected router: Router) {
        super();
        this.localStorage = injector.get(LocalStoreManager);
    }

    // gotoPage(page: string, preserveParams = true) {
    //     const navigationExtras: NavigationExtras = {
    //         queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
    //     };
    //     this.router.navigate([page], navigationExtras);
    // }
    //
    // gotoHomePage() { this.router.navigate([this.homeUrl]); }

    get currentUser(): LoginUser {
      const user = this.localStorage.getDataObject<LoginUser>(DBkeys.CURRENT_USER);
      return user;
    }

    get userPermissions(): ModulePermissionValues[] {
        return this.localStorage.getDataObject<ModulePermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
    }

    public getOrgBranchId = () => this.localStorage.getData(DBkeys.ORG_BRANCH_ID);
    get orgSessionId(): string { return this.localStorage.getData(DBkeys.ORG_SESSION); }

    public updateOrgBranch(orgBranchId) { this.localStorage.savePermanentData(orgBranchId, DBkeys.ORG_BRANCH_ID); }
    public updateOrgSession(orgSessionId) { this.localStorage.savePermanentData(orgSessionId, DBkeys.ORG_SESSION); }

    /*updateOrgTheme(theme: OrgTheme) {
        if (this.rememberMe) {
            this.localStorage.savePermanentData(theme, DBkeys.UI_SETTING);
        } else {
            this.localStorage.saveSyncedSessionData(theme, DBkeys.UI_SETTING);
        }
        this.configurations.themeId = <any>theme?.name;
        this.configurations.uiSetting = <OrgTheme>theme;
    }*/

    // toDateControlInput(val) {
    //     let _date = val;
    //     if (!val) {
    //         _date = new Date();
    //     }
    //
    //     const day = _date.getDate();
    //     const month = _date.getMonth() + 1;
    //     const year = _date.getFullYear();
    //     return year + "-" + month.toString().padStart(2, 0) + "-" + day.toString().padStart(2, 0);
    // }

    // public saveGlobalFilter(gFilter: GlobalFilterModel, sync: boolean = true) {
    //   if (this.rememberMe) {
    //     this.localStorage.savePermanentData(gFilter, DBkeys.GLOBAL_FILTER);
    //   } else {
    //     this.localStorage.saveSyncedSessionData(gFilter, DBkeys.GLOBAL_FILTER);
    //   }
    //
    //   if(sync){
    //     this._globalFilterSync.next(gFilter);
    //   }
    // }
    //
    // public globalFilter(): GlobalFilterModel {
    //   return this.localStorage.getDataObject<GlobalFilterModel>(DBkeys.GLOBAL_FILTER);
    // }
    //
    // applyGlobalFilter(data:  GlobalFilterModel){
    //   this.saveGlobalFilter(data, true);
    // }
    //****************************************//
}
