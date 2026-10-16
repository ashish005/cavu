import {Injectable, Injector} from '@angular/core';
import {CoreEndpointBase} from "../../endpoint-base.service";
import {catchError, map, BehaviorSubject, Observable, forkJoin } from "rxjs";
import {ModulePermission} from "./module-permission.model";
import {Resolve} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AppPermissionService extends CoreEndpointBase implements Resolve<any>
{
  private onPermissionChanged: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public permissionChanged$ = this.onPermissionChanged.asObservable();

  private modulePer: Map<string, ModulePermission>;
  public getHasViewAccessByCode = (code: string) => (this.modulePer && this.modulePer.get(code) || {view: false}).view;

    constructor(override injector: Injector) { super(injector); }

    resolve() {
        return new Promise<any>((resolve, reject) => {
            const success = (results) => { return resolve(true); };
            const failure = (err: any) => { return reject(false); };

            const userId = super.getUserId();
            const setup = forkJoin(
                this.getPermissions(userId)
            );
            return this.performRouteResolver({name: 'App Permission' }, setup, success, failure);
        });
    }

    /**
     * The signed-in member's module access from the tenant API (`GET v1/org-admin/me/access`): per module code, whether
     * they may view, create, modify and delete (their roles' permissions, limited by the plan; administrators hold all).
     */
    public getPermissions = (_orgUserId?: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}/v1/org-admin/me/access`, this.requestHeaders)
        .pipe(
            map((resp: any) => { this.setupModulePermission(resp?.data?.modules); return resp; }),
            catchError(error => super.handleError(error, () => this.getPermissions()))
        );

    private setupModulePermission(data) {
        const modulePer = new Map<string, ModulePermission>();
        (data || []).forEach((curr) => {
            modulePer.set(curr.code, new ModulePermission(curr));
            (curr.children || []).forEach(child => modulePer.set(child.code, new ModulePermission(child)));
        });
        this.modulePer = modulePer;
        this.onPermissionChanged.next(modulePer);
    }

    /**
     * Menu items the member may open. An item is hidden only when its `code` is a module the API knows and the member
     * cannot view it; items without a code, codes the API does not list (sector menus) and menus built before the
     * permissions load stay visible. The API still refuses what the member may not do.
     */
    public getEmployeeNavList(routeData: Array<any>) {
        const codePerm = (result, curr) => {
            const known = curr.code && this.modulePer?.get(curr.code);
            if (!known || known.view) {
                result.push(curr);
            }
            return result;
        };

        const filterRouteData = (r: any) => {
            r.children = (r.children || []).reduce(codePerm, []);
            if (r.children.length > 0) {
                return true;
            }
            return false;
        };
        return routeData.filter(filterRouteData);
    }
}
