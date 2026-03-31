import {Injectable, Injector} from "@angular/core";
import {SharedService, AlertService, ASIDE_CLASS, ASIDE_SIZE} from "@app-global";
import {FeedbackSupportFactory, GlobalFilterFactory} from "./global";
@Injectable({ providedIn: 'root' })
export class SetupFactory {
  constructor(private sharedService: SharedService,
              private supportFactory: FeedbackSupportFactory,
              private globalFilterFactory: GlobalFilterFactory) { }

    showGlobalFilterPopup=()=> this.globalFilterFactory.showGlobalFilterPopup()

  /*showLoginPopup() {
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

    createSupportTicket=() => this.supportFactory.createSupportTicket();
    showBellPopup=() => this.supportFactory.showBellPopup();
    showSurveyPopup=() => this.supportFactory.showSurveyPopup();
}