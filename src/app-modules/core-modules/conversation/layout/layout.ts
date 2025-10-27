import {AfterViewInit, Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class ConversationLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute){}

    option = {
        'inbox': 'inbox',
        'sent': 'sent',
        'outbox': 'outbox',
        'draft': 'draft'
    };
    activeConvType: string;
    public get isInbox(){ return this.activeConvType == this.option.inbox;}
    public get isSent(){ return this.activeConvType == this.option.sent;}
    public get isOutbox(){ return this.activeConvType == this.option.outbox;}
    public get isDraft(){ return this.activeConvType == this.option.draft;}
    setActiveConvType(val){ this.activeConvType = val; };

    ngOnInit(){
        // this.apiResolver.activeConvType.subscribe(r => {
        //     this.activeConvType = r;
        // });
    }

    onActivate(componentRef){ this.actionTemplate = componentRef.actionTemplate; }

    newConversation(){
        // const { id, userTypeId, fullName } = this.coreService.currentUser;
        // const inputData: any = {
        //     data: new NotificationUser({
        //         orgUserId: id,
        //         userTypeId: userTypeId,
        //
        //     }),
        //     actionType: ACTION_ENUM.SHOW
        // };
        // const popupHeader = {text: `Communication info for ${fullName}`, desc: ``};
        //
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (e) => { this.pluginFactory.destroy(); };
        //
        // this.pluginFactory.showUserNotificationTemplateViewPopup(inputData, popupHeader).then(success, failure);
    }
}
