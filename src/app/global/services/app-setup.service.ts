import {inject, Injectable, Injector} from '@angular/core';

import {environment} from "@app-environments";
import {LoaderService} from "./loader.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSetup} from "./models/app-setup.serializer";
import {ThemeManagerService} from "../modules/theme-setting/services/theme-manager.service";
import {catchError, finalize, forkJoin, map, Observable} from "rxjs";
import {AlertService} from "../modules/alert";

@Injectable({ providedIn: 'root' })
export class AppSetupService {
    apiVersion: string = '1.0.2';
    appVersion = '1.0.2';//ConfigurationService.appVersion;

    public appSetup: AppSetup;

    private loaderService: LoaderService;
    private httpClient: HttpClient;
    private themeManager: ThemeManagerService;
    private alertService: AlertService;

    public showGlobalFilterPopup: { (): void } | undefined;

    public showBellPopup: { (): void } | undefined;
    public createSupportTicket: { (): void } | undefined;
    public showSurveyPopup: { (): void } | undefined;

    public toggleThemeSwitcher: { (): void } | undefined;

    protected get baseAPIUrl() { return environment.authBaseUrl + '/api'; }
    protected get baseSectorAPIUrl(): string { return this.appSetup.tenantPoint + '/api'; }
    constructor(private injector: Injector) {
        this.loaderService = injector.get(LoaderService);
        this.httpClient = injector.get(HttpClient);
        this.themeManager = injector.get(ThemeManagerService);
        this.alertService = injector.get(AlertService);

        this.toggleThemeSwitcher = () => this.themeManager.toggleThemeSwitcher();
    }

  loadApp = () => {
    this.loaderService.show();
    const promise = new Promise<boolean>((resolve, reject) => {
        const endpointUrl = `${environment.authBaseUrl}/appSetup/pre`;
        const loadApp = this.httpClient.get(endpointUrl, { headers: new HttpHeaders() });
        loadApp.subscribe({
          next: (response: any) => {
            const { isSuccess, data, message } = response;
            if(isSuccess) {
                this.appSetup = data ? new AppSetup(data): null;
                this.themeManager.applySetting(this.appSetup?.theme);
            }
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

    public onFinalizeSetup(branch: any) {
        this.alertService.startLoadingMessage('Branch Setup sync started...', 'Sync Initiated...');
        branch.syncInitiated = true;

        const branchId = branch.id;

        const error = () => {
            branch.syncInitiated = false;
            branch.isMasterSeedApplied = false;
            branch.isDemoSeedApplied = false;

            setTimeout(() => { this.alertService.stopLoadingMessage(); }, 500);
        };

        const success = () => {
            branch.syncInitiated = false;
            branch.isMasterSeedApplied = true;
            branch.isDemoSeedApplied = true;

            var q = this.httpClient.put(this.baseAPIUrl+`/tenantSeeder/success`, {orgBranchId: branchId}).toPromise();
            q.then(()=>{
                location.href = "/app";
            });
        };

        const setup= forkJoin([
            this.syncUserRolesEndpoint(branchId),
            this.seederOrgBranchAsync(branchId)
        ]);
        setup.pipe(
            map((results) => results)
        ).subscribe(success, error);
    }

    public synchBranch(){
        const branch = this.appSetup?.getDefaultHeadBranch();
        const hasOrgBranchSeededSetup= this.appSetup.hasOrgBranchSeededSetup(branch);
        if(!hasOrgBranchSeededSetup) {
            this.onFinalizeSetup(branch);
            // const accept = ()=> { this.onFinalizeSetup(branch); };
            // const message = `Tax implication in Fee Structure will Change Automatically. Do you want to update student's existing fee record of current session`;
            // this.alertService.showDialog(message, DialogType.confirm, accept, refused);
        }
    }

    seederOrgBranchAsync = (orgBranchId) => this.applySeed(orgBranchId, 'master');
    seederOrgBranchDemo = (orgBranchId) => this.applySeed(orgBranchId, 'demo');

    private applySeed = (orgBranchId, moduleMasterType): Observable<any> => {
        const { id, businessMasterType, softwareCode, orgConfig} = this.appSetup;
        const {
            countryId, countryCode,
            timeZone, ofcStartTime, ofcEndTime, fyStartDay, fyStartMonth,
            currencyCode, cultureCode
        } = orgConfig;

        const reqBody = {
            orgBranchId: orgBranchId,
            orgUnitId: id,
            timeZone: timeZone, ofcStartTime, ofcEndTime, fyStartDay: fyStartDay, fyStartMonth: fyStartMonth,
            countryCode: countryCode,
            countryId: countryId,
            currencyCode: currencyCode,
            cultureCode: cultureCode,
            module: moduleMasterType,
            //sectorMasterType: sectorMasterType,
            businessMasterType: businessMasterType,
            SoftwareCode: softwareCode
        };
        return this.httpClient.post(`${this.baseSectorAPIUrl}/seed/tenant`, reqBody).pipe();
    };

    public syncUserRolesEndpoint=(orgBranchId)=> {
        const { id : orgId} = this.appSetup;
        return this.httpClient.get(this.baseAPIUrl+`/orgSetupLookup/org-roles-to-sync`)
            .pipe().toPromise()
            .then((r: { data })=>
            {
                return this.httpClient.post(this.baseSectorAPIUrl+`/seed/${orgId}/syncUserRole`, r.data).toPromise();
            });
    }
}
