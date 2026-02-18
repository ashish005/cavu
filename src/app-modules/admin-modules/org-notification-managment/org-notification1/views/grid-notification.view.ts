import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../services/notification.service";
import {ViewExtender} from "@app-global";
import {
    NotificationMediaTypeTemplate,
    OrgNotification,
    OrgNotificationQueryOptions
} from "../domains/notification.serializer";
import {OrgNotificationAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    templateUrl: './templates/grid-notification.html'
})
export class GridNotificationView extends ViewExtender<OrgNotification> implements OnInit, OnDestroy {
  override coreState: OrgNotificationQueryOptions = new OrgNotificationQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: NotificationService,
                public lookupResolver: OrgNotificationAPIResolver){ super(activatedRoute, service); }
    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }
    updateNotification = (row: OrgNotification) => this.lookupResolver.notificationUpdatePopup(row, ()=> super.populateGrid());
    showScheduler = (row: OrgNotification) => this.lookupResolver.showSchedulerPopup(row, (orgTaskScheduleId) => {
        //row.orgTaskScheduleId = orgTaskScheduleId;
        super.populateGrid();
    });

    showTemplateToCreateEdit = (notificationId, template: NotificationMediaTypeTemplate) => this.lookupResolver.notificationTemplateCreateEdit(notificationId, template.masterType, template.name, () => {});
}
