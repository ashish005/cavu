import {inject, Injectable, Injector} from '@angular/core';
import {CoreEndpointBase} from "./endpoint-base.service";
import {OrgLookup} from "./models/org-lookup.serializer";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import {catchError, from, Observable, tap} from "rxjs";

@Injectable({ providedIn: 'root' })
export class OrgLookupService extends CoreEndpointBase implements Resolve<any>{
    private orgLookup: OrgLookup;

    public getOrgLookup = ()=> this.orgLookup;
    public getVoucherTypeDictionary = () => this.orgLookup?.voucherTypeDictionary;
    constructor(protected override injector: Injector) { super(injector); }

    private fetchOrgLookup() {
        /*this.loaderService.show();
        const promise = new Promise<boolean>((resolve, reject) => {
            const catchErr = (err)=> {
                // Handle the error, e.g., with an alert service
                // alertService.showError('Failed to load app data');
                this.loaderService.hide();
                reject(err);
            }
            const success = (response)=> {
                const { isSuccess, data, message } = response;
                this.loaderService.hide();
                if(data) {
                    this.orgLookup = new OrgLookup(data);
                }
                // alertService.showSuccess(message);
                resolve(true);
            };
            const endpointUrl = `${this.baseSectorAPIUrl}/orgLookup/${this.apiVersion}`;
            const loadApp = this.httpClient.get(endpointUrl, this.requestHeaders);
            loadApp.pipe(
                tap(
                    catchError(error=> this.handleError(error, () => this.fetchOrgLookup()))
                )
            );
            loadApp.subscribe({ next: success, error: catchErr });
          });
        return promise;*/

        const success = (results) => { this.orgLookup = new OrgLookup(results.data); };
        const failure = (err: any) => {
            return this.handleError(err, () => from(this.fetchOrgLookup()));
        };

        const endpointUrl = `${this.baseSectorAPIUrl}/orgLookup/${this.apiVersion}`;
        const setup = this.httpClient.get(endpointUrl, this.requestHeaders);
        return this.performRouteResolver({}, setup, success, failure);
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
