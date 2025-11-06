import {Injectable, Injector} from "@angular/core";
import {SharedService, AlertService} from "@app-global";
import {CoreSetupFactory} from "./org-seeder";
@Injectable({ providedIn: 'root' })
export class SetupFactory {
  constructor(private sharedService: SharedService,
              private alertService: AlertService,
              private coreSetupFactory: CoreSetupFactory) { }

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
}
/*

@Injectable({ providedIn: 'root' })
export class FeedbackSupportFactory {
    sharedService: SharedService;
    constructor(public injector: Injector) { this.sharedService = injector.get(SharedService); }

    createSupportTicket(){
        const popupOptions = {
            header: { text: `Report Issue`, desc: 'Automatically captures the page where you are facing issues' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const data = {
            supportType: 'technical_support',
            mediaType: 'dashboard'
        };
        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };
        return this.sharedService.showCustomPopup(SupportComponent, popupOptions, data).then(onSuccess, onFailure);
    }

    showBellPopup(){
        const popupOptions = {
            header: { text: `Bell Info`, desc: 'Check all notification, events and schedules' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const data = {};
        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };
        return this.sharedService.showCustomPopup(NotificationBellReminderComponent, popupOptions, data).then(onSuccess, onFailure);
    }

    showSurveyPopup(){
        const popupOptions = {
            header: { text: `Survey`, desc: 'How strongly do you agree or disagree with this statement?' },
            aside: ASIDE_CLASS.BOTTOM_RIGHT,
            size: ASIDE_SIZE.LARGE,
            backdropDisabled: true
        };
        const data = {};

        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };
        return this.sharedService.showCustomPopup(SurveyComponent, popupOptions, data).then(onSuccess, onFailure);
    }

    /!*showChatPopup(){
        const popupOptions = {
            header: { text: `Chat`, desc: 'chat System' },
            aside: ASIDE_CLASS.BOTTOM_RIGHT,
            size: ASIDE_SIZE.W_25,
            backdropDisabled: true
        };

        const data = {};
        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };
        return this.sharedService.showCustomPopup(ChatComponent, popupOptions, data).then(onSuccess, onFailure);
    }*!/
}*/
