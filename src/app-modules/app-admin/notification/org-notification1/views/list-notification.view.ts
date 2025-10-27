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
  templateUrl: './templates/list-notification.html'
})
export class ListNotificationView extends ViewExtender<OrgNotification> implements OnInit, OnDestroy {
  override coreState: OrgNotificationQueryOptions = new OrgNotificationQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: NotificationService,
              public lookupResolver: OrgNotificationAPIResolver) {
        super(activatedRoute, service);
    }

    ngOnInit() { super.populateGrid(); }

    ngOnDestroy() { super.ngOnDestroy(); }

    showTemplateToCreateEdit(row: OrgNotification, template: NotificationMediaTypeTemplate) {
        this.router.navigate([row.id, template.masterType], {relativeTo: this.activatedRoute});
    };

    updateNotification = (row: OrgNotification) => {
        this.lookupResolver.notificationUpdatePopup(row, () => super.populateGrid());
    };

    showScheduler = (row: OrgNotification) => this.lookupResolver.showSchedulerPopup(row, (orgTaskScheduleId) => {
        //row.orgTaskScheduleId = orgTaskScheduleId;
    });

    checkActivity(data: OrgNotification) {
        const { schedulerConfig, name } = data;
        const { orgTaskId, orgTaskScheduleId, isManual } = schedulerConfig;
        const popupHeaderOption = { text: `Activity for ${name}`, desc: `Activity` };
        const inputData: any = { orgTaskId: orgTaskId, scheduleId: orgTaskScheduleId };
        this.lookupResolver.showEventTaskActivityPopup(inputData, popupHeaderOption);
    }
}
