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
/*@Injectable()
export class BusinessService extends CoreEndpointBase {
  public get businessUrl (){ return `${this.baseAPIUrl}tenant`; }
  public get tenantSeederUrl (){ return `${this.baseAPIUrl}tenantSeeder`; }
  public get orgPermissionUrl (){ return `${this.baseAPIUrl}orgPermission`; }

  // getRootRequestHeaders(){
  //     const {accessToken, apiVersion, appVersion } = this.coreService;
  //     const headers = new HttpHeaders({
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //         'Accept': `application/vnd.iman.v${apiVersion}+json, application/json, text/plain, *!/!*`,
  //         'App-Version': appVersion
  //     });
  //     return headers;
  // }

    public list(queryOptions: BusinessQueryOptions) {
        return this.httpClient
            .get(`${this.businessUrl}?${queryOptions.toQueryString()}`, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.list(queryOptions)))
            );
    }

    public create(item: any): Observable<any> {
        return this.httpClient.post(this.businessUrl, item, this.requestHeaders)
            .pipe(
                //tap(data => this.notifyResponse(data)),
                catchError(error => this.handleError(error, () => this.create(item)))
            );
    }

    public update(id: string | number, item: any): Observable<any> {
        return this.httpClient
            .put(`${this.businessUrl}/${id}`, item, this.requestHeaders)
            .pipe(
                //tap(data => this.notifyResponse(data)),
                catchError(error => this.handleError(error, () => this.update(id, item)))
            );
    }

  seedTenantByType(dataModal: any){
    const { orgUnitId, countryId, orgSessionId } = dataModal;
    //const {accessToken, apiVersion, appVersion } = this.coreService;
    const orgBranchId = '';//this.coreService.getOrgBranchId();
    // const headers = new HttpHeaders({
    //     Authorization: `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json',
    //     'Accept': `application/vnd.iman.v${apiVersion}+json, application/json, text/plain, *!/!*`,
    //     'App-Version': appVersion,
    //     'OrgUnitId': orgUnitId || '',
    //     'OrgBranchId': orgBranchId || '',
    //     'OrgSessionId': `${orgSessionId || ''}`,
    //     'OrgCountryId': `${countryId|| ''}`
    // });
    return this.httpClient.post(this.tenantSeederUrl, dataModal, this.requestHeaders);
  }
}*/
