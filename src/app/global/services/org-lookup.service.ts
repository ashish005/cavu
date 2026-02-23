import {inject, Injectable, Injector} from '@angular/core';
import {CoreEndpointBase} from "./endpoint-base.service";
import {OrgLookup} from "./models/org-lookup.serializer";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";

@Injectable({ providedIn: 'root' })
export class OrgLookupService extends CoreEndpointBase implements Resolve<any>{
    private orgLookup: OrgLookup;

    public getOrgLookup = ()=> this.orgLookup;
    public getVoucherTypeDictionary = () => this.orgLookup?.voucherTypeDictionary;
    constructor(protected override injector: Injector) { super(injector); }

    private fetchOrgLookup = () => {
        this.loaderService.show();
        const promise = new Promise<boolean>((resolve, reject) => {
            const endpointUrl = `${this.baseSectorAPIUrl}/orgLookup/${this.apiVersion}`;
            const loadApp = this.httpClient.get(endpointUrl, this.requestHeaders);
            loadApp.subscribe({
              next: (response: any) => {
                const { isSuccess, data, message } = response;
                this.loaderService.hide();
                if(data) {
                    this.orgLookup = new OrgLookup(data);
                }
                // alertService.showSuccess(message);
                resolve(true);
              },
              error: (err) => {
                // Handle the error, e.g., with an alert service
                // alertService.showError('Failed to load app data');
                this.loaderService.hide();
                reject(err);
              }
            });
          });
        return promise;
    }

    resolve = (route: ActivatedRouteSnapshot) => this.fetchOrgLookup();

  /*public getBusinessSetupModules(sectorMasterType: string, businessMasterType: string): Observable<any> {
    return this.httpClient
      .get(`${this.baseAPIUrl}tenantSeeder/${sectorMasterType}/${businessMasterType}/modules`, this.requestHeaders)
      .pipe(
        catchError(error => this.handleError(error, () => this.getBusinessSetupModules(sectorMasterType, businessMasterType)))
      );
  }*/
}
