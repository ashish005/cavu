import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationAPIResolver} from "../services/api.resolver";
import {OrgNotification} from "../domains/notification.serializer";
import {NotificationTypeLookup} from "../domains/lookup.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class Layout {
    @ViewChild('actionTemplate', {static: true}) public actionTemplate: TemplateRef<any>;
    userMasterType: string;
    hideHeader: boolean;
    activeNotificationType: NotificationTypeLookup;

    constructor(public router: Router, public activatedRoute: ActivatedRoute, public lookupResolver: NotificationAPIResolver) {
        const { userType, hideHeader } = this.activatedRoute.snapshot.data;
        this.userMasterType = userType;
        this.hideHeader = hideHeader;
    }

    menuItems: Array<any> = [
        {name: 'List', sortOrder: 2, route: 'list', icon: 'fa-list'},
        {name: 'Board', sortOrder: 3, route: 'board', icon: 'fa-table'}
    ];

    viewNavigations = [
        {name: 'Schedules', sortOrder: 5, route: 'schedules'},
        {name: 'Reminders', sortOrder: 5, route: 'reminders'}
    ];

    showData(item) {
        this.router.navigate([item.route], {relativeTo: this.activatedRoute});
    }

    onActivate(componentRef) {
        //this.actionTemplate = componentRef.actionTemplate;
    }

    createNotification() {
        const {notificationTypes} = this.lookupResolver.masterType;
        const notificationType = (notificationTypes || []).find(r => r.masterType == this.userMasterType);
        const data = new OrgNotification({
            name: '',
            notificationTypeId: notificationType?.id
        });
        const inputData: any = {
            id: null,
            isEventBased: false,
            data: data
        };
        this.lookupResolver.notificationCreateEditPopup(inputData, {text: `New Notification`, desc: ''}, () => {

        });
    }
}