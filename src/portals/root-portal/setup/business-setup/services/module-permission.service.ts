import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import {catchError, Observable, tap} from "rxjs";
import {ModulePermission, ModulePermissionSerializer} from "../domains/module-permission.serializer";

@Injectable()
export class ModulePermissionService extends OrgResourceService<ModulePermission>{
  constructor(public override injector: Injector) { super(injector, '/v1/modulePermission', new ModulePermissionSerializer());}

  updatePermission(orgUnitId: string, body: any){
    return this.httpClient.post(`${this.viewUrl}/${orgUnitId}`, body, this.requestHeaders)
      .pipe(
        //tap(data => this.notifyResponse(data)),
        catchError(error => this.handleError(error, () => this.updatePermission(orgUnitId, body)))
      );
  }

  updateBusinessPermissionModulesByLicenseType(orgUnitId: string, orgSectorMasterType: string, body: any){
       return this.patch(`${orgUnitId}/${orgSectorMasterType}`, body);
    }
}
