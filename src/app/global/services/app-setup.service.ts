import {inject, Injectable, Injector} from '@angular/core';

import {environment} from "@app-environments";
import {LoaderService} from "./loader.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSetup} from "./models/app-setup.serializer";
import {ThemeManagerService} from "../modules/theme-setting/services/theme-manager.service";
import {finalize, last, map, Observable, switchMap, take, takeWhile, timer} from "rxjs";
import {AlertService, MessageSeverity} from "../modules/alert";

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

    public get baseAPIUrl() { return environment.authBaseUrl + '/api'; }
    public get baseSectorAPIUrl(): string { return environment.tenantUrl + '/api'; }
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
        const endpointUrl = `${this.baseSectorAPIUrl}/v1/appSetup/pre`;
        const loadApp = this.httpClient.get(endpointUrl);// { headers: new HttpHeaders() }
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

    /** Seed states that end the wait. */
    private static readonly SEED_DONE = ['Completed', 'Failed'];

    /**
     * Sets up a branch that has not been seeded: queues the seed on the tenant API (`POST v1/seed/tenant`), then polls
     * `GET v1/seed/{branchId}/status` every 3 seconds (for up to 10 minutes) and reloads the app once it is Completed.
     */
    public onFinalizeSetup(branch: any) {
        this.alertService.startLoadingMessage('Setting up your branch. This takes a minute or two…', 'Setting up');
        branch.syncInitiated = true;
        const branchId = branch.id;

        const stop = (message?: string) => {
            branch.syncInitiated = false;
            setTimeout(() => this.alertService.stopLoadingMessage(), 300);
            if (message) { this.alertService.showMessage('Setup not finished', message, MessageSeverity.error); }
        };

        this.applySeed(branchId, true, false).pipe(
            switchMap(() => timer(0, 3000).pipe(take(200))),
            switchMap(() => this.seedStatus(branchId)),
            takeWhile((s: any) => !AppSetupService.SEED_DONE.includes(s?.status), true),
            last(),
            finalize(() => branch.syncInitiated = false)
        ).subscribe({
            next: (s: any) => {
                if (s?.status === 'Completed') {
                    branch.isMasterSeedApplied = true;
                    stop();
                    location.href = '/app';
                } else {
                    stop(s?.status === 'Failed' ? (s?.lastError || 'The branch setup failed. Try again from Settings › Branches.') : 'The branch setup is taking longer than expected. It continues in the background.');
                }
            },
            error: (e) => stop(e?.error?.message || 'The branch setup could not start.')
        });
    }

    public synchBranch(){
        const branch = this.appSetup?.getDefaultHeadBranch();
        if (branch && !this.appSetup.hasOrgBranchSeededSetup(branch) && !branch.syncInitiated) {
            this.onFinalizeSetup(branch);
        }
    }

    seederOrgBranchAsync = (orgBranchId) => this.applySeed(orgBranchId, true, false);
    seederOrgBranchDemo = (orgBranchId) => this.applySeed(orgBranchId, true, true);

    private applySeed(orgBranchId: string, master: boolean, demo: boolean): Observable<any> {
        const reqBody = {orgId: this.appSetup?.id, orgBranchId, applyMasterSeed: master, applyDemoSeed: demo};
        return this.httpClient.post(`${this.baseSectorAPIUrl}/v1/seed/tenant`, reqBody).pipe(
            map((r: any) => { if (r?.isSuccess === false) { throw {error: r}; } return r; })
        );
    }

    private seedStatus(orgBranchId: string): Observable<any> {
        return this.httpClient.get(`${this.baseSectorAPIUrl}/v1/seed/${orgBranchId}/status`).pipe(map((r: any) => r?.data));
    }
}
