import {Injectable, Injector} from "@angular/core";
import {OrgResourceService} from "@app-global";
import { ModulePermission, ModulePermissionSerializer } from "../domains/module-permission.serializer";
import {catchError, Observable, tap} from "rxjs";
import {Business, BusinessSerializer} from "../domains/business.serializer";
import {SoftwarePrice, SoftwarePriceSerializer} from "../domains/org-software-license.serializer";

@Injectable()
export class BusinessService extends OrgResourceService<Business>{
  constructor(public override injector: Injector) { super(injector, 'v1/tenant', new BusinessSerializer());}

  public trialRegister(item: any): Observable<any> {
    return this.httpClient.post(this.viewUrl + '/trialRegister', item)
        .pipe(
            tap(data => data),
            catchError(error => error)
        );
  }
}

@Injectable()
export class PricingService extends OrgResourceService<SoftwarePrice>{
  constructor(public override injector: Injector) { super(injector, 'v1/software', new SoftwarePriceSerializer());}
  public getPlans = (softwareId: any) => this.httpClient.get(`${this.viewUrl}/plans/${softwareId}`, this.requestHeaders);
  public getModules = (softwareId) => this.httpClient.get(`${this.viewUrl}/${softwareId}/modules`, this.requestHeaders);
}

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
