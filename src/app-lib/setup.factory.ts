import {Injectable, Injector} from "@angular/core";
import {SharedService, AlertService} from "@app-global";
import {CoreSetupFactory} from "./org-seeder";
import {FeedbackSupportFactory} from "./global";
@Injectable({ providedIn: 'root' })
export class SetupFactory {
  constructor(private sharedService: SharedService,
              private alertService: AlertService,
              private coreSetupFactory: CoreSetupFactory, private supportFactory: FeedbackSupportFactory) { }

    /*showGlobalFilterPopup(inputData, popupheader){
        const popupOptions = {
            header: popupheader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const success = ()=> {
            /!*const { countryId, country } = data;
                this.coreService.updateCountry(countryId);
                // changes the route without moving from the current view or
                this.router.navigate(['refresh'], { skipLocationChange: true });

                setTimeout ((url) => {
                    this.router.navigateByUrl(url, { /!* Removed unsupported properties by Angular migration: relativeTo, queryParamsHandling. *!/ skipLocationChange: false });
                }, 10, this.router.url);*!/
            this.sharedService.destroy();
        };
        const failure = ()=> { this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(GlobalFilterComponent, popupOptions, inputData).then(success, failure);
    }

    showLoginPopup() {
        const onSuccess = (resp)=> {
            this.alertService.resetStickyMessage();
            // if (this.coreService.isSessionExpired) {
            //     this.alertService.showStickyMessage(this.gT('app.alerts.SessionExpired'), this.gT('app.alerts.SessionExpiredLoginToRenewSession'), MessageSeverity.warn);
            // }
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            //this.alertService.showStickyMessage(this.gT('app.alerts.SessionExpired'), this.gT('app.alerts.SessionExpiredLoginAgain'), MessageSeverity.warn);
            this.sharedService.destroy();
        };
        const popupOptions = {
            header: { text: `Login to your account`, desc: '' },
            aside: ASIDE_CLASS.CENTER,
            size: ASIDE_SIZE.W_XL,
            //backdropDisabled: true
        };
        this.sharedService.showCustomPopup(ReLoginComponent, popupOptions, { isModal: true }).then(onSuccess, onFailure);
    }*/

    showPreSetupPopup() {
        const refreshPage = () => setTimeout(() => { location.href = location.href; }, 100);
        const onSuccess = (resp)=> {
            this.coreSetupFactory.destroy();
            refreshPage();
        };
        const onFailure = (resp)=> {
            this.coreSetupFactory.destroy();
            refreshPage();
        };
        this.coreSetupFactory.showPreSetupPopup().then(onSuccess, onFailure);
    }

    createSupportTicket=() => this.supportFactory.createSupportTicket();
    showBellPopup=() => this.supportFactory.showBellPopup();
    showSurveyPopup=() => this.supportFactory.showSurveyPopup();
}