import {Injectable, NgModule} from "@angular/core";
import {SupportUiService} from "@app-global";

/**
 * Opens the support panels (hosted by the global `<support-center>` in the app header): the notification bell,
 * report a problem / my tickets, and feedback. Kept for the app's existing `setupFactory` hooks.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackSupportFactory {
    constructor(private support: SupportUiService) {}

    createSupportTicket = () => this.support.open('report');
    showBellPopup = () => this.support.open('bell');
    showSurveyPopup = () => this.support.open('feedback');
}

@NgModule({})
export class FeedbackSupportModule {}
