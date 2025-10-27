import {Observable, Subject} from "rxjs";
import {Injectable, Injector} from "@angular/core";
import { OrgModuleModel, OrgModuleModelSerializer } from "../domains/org-module.domain";
import { OrgResourceService } from "@app-global";

@Injectable()
export class RolePermissionService extends OrgResourceService<OrgModuleModel> {
  constructor(public override injector: Injector) { super(injector, 'orgModule', new OrgModuleModelSerializer()); }

  createRole<T>(userObject: any): Observable<T> {
    const url: string = `${this.viewUrl}/role`;
    return this.httpClient.post<T>(url, JSON.stringify(userObject), this.requestHeaders);
  }

  updateRole<T>(userObject: any): Observable<T> {
    const url: string = `${this.viewUrl}/role/${userObject.id}'`;
    return this.httpClient.put<T>(url, JSON.stringify(userObject), this.requestHeaders);
  }

  updateModulePermissions<T>(userTypeId: string, userObject: any): Observable<T> {
    const url: string = `${this.viewUrl}/permission/${userTypeId}`;
    return this.httpClient.put<T>(url, JSON.stringify(userObject), this.requestHeaders);
  }
}

@Injectable()
export class UserPermissionService extends OrgResourceService<OrgModuleModel> {
    constructor(public override injector: Injector) {
      super(injector, 'userPermission', new OrgModuleModelSerializer());
    }

    getModuleByRoleId(id: string): Observable<any> {
        const url: string = `${this.viewUrl}/role-modules/${id}`;
        return this.httpClient.get<any>(url, this.requestHeaders);
    }

    getModuleByOrgUserId(id: string): Observable<any> {
        const url: string = `${this.viewUrl}/perm-check/${id}`;
        return this.httpClient.get<any>(url, this.requestHeaders);
    }

    postModuleByRoleId(ids: Array<string>): Observable<any> {
        const url: string = `${this.viewUrl}/role-modules`;
        return this.httpClient.post<any>(url, ids, this.requestHeaders);
    }
}
