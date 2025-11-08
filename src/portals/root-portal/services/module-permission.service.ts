import {Injectable, Injector} from "@angular/core";
import { CoreEndpointBase, CoreResourceService } from "@app-global";
import { ModulePermission, ModulePermissionQueryOptions, ModulePermissionSerializer } from "../domains/module-permission.serializer";
import {catchError, Observable, tap} from "rxjs";

@Injectable()
export class ModulePermissionService extends CoreResourceService<ModulePermission>{
  constructor(public override injector: Injector) { super(injector, 'modulePermission', new ModulePermissionSerializer());}

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
