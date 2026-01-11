import {Injectable, Injector} from '@angular/core';
import {CoreEndpointBase} from "../../endpoint-base.service";
import {catchError, map, BehaviorSubject, Observable, forkJoin } from "rxjs";
import {ModulePermission} from "./module-permission.model";

@Injectable({providedIn: 'root'})
export class AppPermissionService extends CoreEndpointBase
{
  private onPermissionChanged: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public permissionChanged$ = this.onPermissionChanged.asObservable();

  private modulePer: Map<string, ModulePermission>;
  public getHasViewAccessByCode = (code: string) => (this.modulePer && this.modulePer.get(code) || {view: false}).view;

    constructor(override injector: Injector) { super(injector); }

    resolveAppPermissions() {
        return new Promise<any>((resolve, reject) => {
            const success = (results) => { return resolve(true); };
            const failure = (err: any) => { return reject(false); };

            const setup = forkJoin(
                //this.fetchOrgLookup(),
                this.getPermissions(null)//(this.authService.userId)
            );
            return this.performRouteResolver({name: 'App Permission' }, setup, success, failure);
        });
    }

    public getPermissions = (orgUserId) => this.httpClient
        .get(`${this.baseAPIUrl}userPermission/perm-check/${orgUserId}`, this.requestHeaders)
        .pipe(
            map((resp: any) => { this.setupModulePermission(resp?.entities); return resp; }),
            catchError(error => super.handleError(error, () => this.getPermissions(orgUserId)))
        );

    private setupModulePermission(data) {
        this.modulePer = null;
        const modulePer = new Map();
        (data || []).forEach((curr) => {
            modulePer.set(curr.code, new ModulePermission(curr));
            (curr.children || []).map(child => {
                modulePer.set(child.code, new ModulePermission(child));
            });
        });
        this.modulePer = modulePer;
    }

    public getEmployeeNavList(routeData: Array<any>) {
        const codePerm = (result, curr) => {
            if (!this.modulePer) {
                if (!curr.code) {
                    result.push(curr);
                }
            } else if (curr.code) {
                const code = this.modulePer.get(curr.code) || {view: false};
                if (code.view) {
                    result.push(curr);
                }
            } else {
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
