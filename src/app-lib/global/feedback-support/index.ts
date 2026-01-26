import {Injectable, Injector, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {
    SUPPORT_COMPONENT,
    NotificationBellReminderComponent,
    SupportComponent,
    SurveyComponent
} from "./components";
import {ASIDE_CLASS, ASIDE_SIZE, GlobalModule, SharedService} from "@app-global";

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

    /*showChatPopup(){
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
    }*/
}

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, GlobalModule
    ],
    providers: [FeedbackSupportFactory],
    declarations: [SUPPORT_COMPONENT, NotificationBellReminderComponent, SupportComponent, SurveyComponent],
    exports: []
})
export class FeedbackSupportModule{}