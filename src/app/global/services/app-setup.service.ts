import {inject, Injectable, Injector} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationExtras, Router, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, map, Observable, of, Subject, throwError} from 'rxjs';

import {environment} from "@app-environments";
import {LoaderService} from "./loader.service";
import {HttpClient} from "@angular/common/http";
import {AppSetup} from "./models/app-setup.serializer";
import {ThemeManagerService} from "../modules/theme-setting/services/theme-manager.service";

@Injectable({ providedIn: 'root' })
export class AppSetupService {
    apiVersion: string = '1.0.2';
    appVersion = '1.0.2';//ConfigurationService.appVersion;

    public appSetup: AppSetup;

    private loaderService: LoaderService;
    private httpClient: HttpClient;
    private themeManager: ThemeManagerService;
    constructor(private injector: Injector) {
        this.loaderService = injector.get(LoaderService);
        this.httpClient = injector.get(HttpClient);
        this.themeManager = injector.get(ThemeManagerService);
    }

  loadApp = () => {
    this.loaderService.show();
    const promise = new Promise<boolean>((resolve, reject) => {
        const endpointUrl = `${environment.authBaseUrl}/appSetup/pre`;
        const loadApp = this.httpClient.get(endpointUrl);
        loadApp.subscribe({
          next: (response: any) => {
            const { isSuccess, data, message } = response;
            this.appSetup = data ? new AppSetup(data): null;
            this.themeManager.applySetting(this.appSetup?.theme);
            // Handle your logic here, e.g., using other injected services
            // alertService.showSuccess(message);
            this.loaderService.hide();
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

  hasAppSetup =()=> (this.appSetup);

  /*public getBusinessSetupModules(sectorMasterType: string, businessMasterType: string): Observable<any> {
    return this.httpClient
      .get(`${this.baseAPIUrl}tenantSeeder/${sectorMasterType}/${businessMasterType}/modules`, this.requestHeaders)
      .pipe(
        catchError(error => this.handleError(error, () => this.getBusinessSetupModules(sectorMasterType, businessMasterType)))
      );
  }

  seederOrgBranchAsync = (configId, orgBranchId) => this.applySeed(configId, orgBranchId, 'master');
  seederOrgBranchDemo = (configId, orgBranchId) => this.applySeed(configId, orgBranchId, 'demo');

  private applySeed = (id, orgBranchId, moduleMasterType): Observable<any> => {
    const tenantSeederCallback = (resp) => {
      const {
        countryCode, timeZone, currencyCode, cultureCode,
        sectorMasterType, businessMasterType, softwareCode,
        orgUnitId
      } = resp;
      const success = ()=> {
        return this.httpClient
          .put(this.baseAPIUrl+`tenantSeeder/success`, {orgBranchId: orgBranchId}, this.requestHeaders)

      }
      return this.httpClient.post(`${this.baseSectorAPIUrl}seed/tenant`, {
        orgBranchId: orgBranchId,
        orgUnitId: orgUnitId,
        timeZone: timeZone,
        countryCode: countryCode,
        currencyCode: currencyCode,
        cultureCode: cultureCode,
        module: moduleMasterType,

        sectorMasterType: sectorMasterType,
        businessMasterType: businessMasterType,
        SoftwareCode: softwareCode
      }, this.requestHeaders).pipe(
        flatMap((res) => success()),
        catchError(error => this.handleError(error, () => tenantSeederCallback(resp)))
      );
    };

    const tenantSeeder=()=> this.httpClient.get(this.baseAPIUrl+`orgSetting/partial/${id}`, this.requestHeaders)
      .pipe(
        flatMap((res: { data }) => tenantSeederCallback(res.data)),
        catchError(error => this.handleError(error, () => tenantSeeder()))
      );

    return tenantSeeder();
  };

  public syncUserRolesEndpoint(orgId, orgBranchId)
  {
    return this.httpClient.get(this.baseAPIUrl+`org-lookup/org-roles-to-sync`, this.requestHeaders).toPromise()
      .then((r: { data })=>
      {
        return this.httpClient.post(this.baseSectorAPIUrl+`seed/syncUserRole/${orgId}/${orgBranchId}`, r.data, this.requestHeaders).toPromise();
      });
  }*/
}
