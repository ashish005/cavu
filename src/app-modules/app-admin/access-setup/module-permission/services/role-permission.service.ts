import {Observable, Subject} from "rxjs";
import {Injectable, Injector} from "@angular/core";
import { OrgModuleModel, OrgModuleModelSerializer } from "../domains/org-module.domain";
import { CoreResourceService } from "@app-global";

@Injectable()
export class RolePermissionService extends CoreResourceService<OrgModuleModel> {
  constructor(public override injector: Injector) { super(injector, 'orgModule', new OrgModuleModelSerializer()); }

  createRole<T>(userObject: any): Observable<T> {
    const url: string = `${this.viewUrl}/role`;
    return this.httpClient.post<T>(url, JSON.stringify(userObject), this.requestHeaders);
  }

  updateRole<T>(userObject: any): Observable<T> {
    const url: string = `${this.viewUrl}/role/${userObject.id}'`;
    return this.httpClient.put<T>(url, JSON.stringify(userObject), this.requestHeaders);
  }


}

@Injectable()
export class UserPermissionService extends CoreResourceService<OrgModuleModel> {
    constructor(public override injector: Injector) {
      super(injector, 'roleModulePermission', new OrgModuleModelSerializer());
    }

    getModuleByOrgUserId(id: string): Observable<any> {
        const url: string = `${this.viewUrl}/perm-check/${id}`;
        return this.httpClient.get<any>(url, this.requestHeaders);
    }

    getModulesByRoleId(ids: Array<string>): Observable<any> {
        return this.httpClient.post<any>(this.viewUrl, ids, this.requestHeaders);
    }

    updateModulePermissions<T>(userTypeId: string, userObject: any): Observable<T> {
        const url: string = `${this.viewUrl}/permission/${userTypeId}`;
        return this.httpClient.put<T>(url, JSON.stringify(userObject), this.requestHeaders);
    }
}
