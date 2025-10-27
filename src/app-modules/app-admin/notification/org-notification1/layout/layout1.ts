import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrgNotificationAPIResolver} from "../services/api.resolver";
import {ORG_PROCESS_TYPE} from "@app-base/enums";
import {
    NotificationMediaTypeTemplate,
    OrgNotification
} from "../domains/notification.serializer";
import {NotificationService} from "../services/notification.service";
import {NotificationTypeLookup} from "../domains/lookup.serializer";

@Component({templateUrl: './templates/layout1.html', styles: [`::ng-deep ng-component{ display: contents;}`]})
export class Layout1 implements OnInit, OnDestroy {//extends ViewExtender<OrgNotificationShortList>
    @ViewChild('actionTemplate', {static: true}) public actionTemplate: TemplateRef<any>;
    notificationType: NotificationTypeLookup;
    //coreState: OrgNotificationShortListQueryOptions;
    activeView: string;
    constructor(public router: Router, public activatedRoute: ActivatedRoute,
                public service: NotificationService, public lookupResolver: OrgNotificationAPIResolver)
    {
        //super(new OrgNotificationShortListQueryOptions(), activatedRoute, service);
    }

    notificationByUserType(row: NotificationTypeLookup){
        //this.coreState.notificationTypeId = row.id;
        this.notificationType = row;
        //super.populateGrid();
    }

    ngOnInit(){
        //super.populateGrid();
    }
    ngOnDestroy(){
        //super.ngOnDestroy();
    }

    menuItems: Array<any> = [
        {name: 'List', sortOrder: 2, route: 'list', icon: 'fa-list'},
        {name: 'Board', sortOrder: 3, route: 'grid', icon: 'fa-table'}
    ];

    showView(item) {
        this.router.navigate([item.route], {relativeTo: this.activatedRoute});
    }

    showTemplateToCreateEdit(row: OrgNotification, template: NotificationMediaTypeTemplate) {
        this.router.navigate([row.id, template.masterType], { relativeTo: this.activatedRoute });
    }

    onActivate(componentRef) {
        const { routeConfig, data } = componentRef.activatedRoute.snapshot;
        this.activeView = routeConfig.path;
    }

    createNotification = () => this.lookupResolver.notificationCreatePopup(() => {});

    /*createNotificationReminder(row: OrgNotification) {
        const { id, schedulerConfig, name } = row;
        const { orgTaskId, orgTaskScheduleId, isManual } = schedulerConfig;

        const headerOption = { text: `Reminder for ${name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const data = {
            id: null,
            //userMasterType: this.userMasterType,
            data: new NotificationReminder({
                orgTaskScheduleId: orgTaskScheduleId,
                notificationId: id
            })
        };
        this.lookupResolver.showOrgTaskReminderCEPopup(data, headerOption, () => {
            super.populateGrid();
        });
    }

    editNotificationReminder(row: NotificationReminder) {
        const { id } = row;

        const headerOption = { text: `Reminder for ${name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const data = {
            id: id,
            //userMasterType: this.userMasterType,
            data: row
        };
        this.lookupResolver.showOrgTaskReminderCEPopup(data, headerOption, () => {
            super.populateGrid();
        });
    }

    showNotificationReminder(row: OrgNotification) {
        const { id, schedulerConfig, name } = row;
        const { orgTaskId, orgTaskScheduleId, isManual } = schedulerConfig;

        const headerOption = { text: `Reminder for ${name}`, desc: `Reminder will be send to user prior to scheduled time` };
        const data = {
            id: null,
            //userMasterType: this.userMasterType,
            data: new NotificationReminder({
                orgTaskScheduleId: orgTaskScheduleId,
                notificationId: id
            })
        };
        this.lookupResolver.showOrgTaskReminderCEPopup(data, headerOption, () => {
            super.populateGrid();
        });
    }*/
}