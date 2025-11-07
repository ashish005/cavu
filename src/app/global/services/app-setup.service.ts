import {inject, Injectable, Injector} from '@angular/core';

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

    public showPreSetupPopup: { (): void } | undefined;
    public showGlobalFilterPopup: { (): void } | undefined;

    public showBellPopup: { (): void } | undefined;
    public createSupportTicket: { (): void } | undefined;
    public showSurveyPopup: { (): void } | undefined;

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
  }*/
}
