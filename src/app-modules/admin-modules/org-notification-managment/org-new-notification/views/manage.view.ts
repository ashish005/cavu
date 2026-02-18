import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../services/notification.service";
import {ViewExtender} from "@app-global";
import {
    NotificationMediaTypeTemplate,
    OrgNotification,
    OrgNotificationQueryOptions
} from "../domains/notification.serializer";
import {NotificationAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    templateUrl: './templates/manage.html'
})
export class ManageNotificationView extends ViewExtender<OrgNotification> implements OnInit, OnDestroy {
  override coreState: OrgNotificationQueryOptions = new OrgNotificationQueryOptions();
  constructor(public router: Router,
              public override activatedRoute: ActivatedRoute,
              public override service: NotificationService, public lookupResolver: NotificationAPIResolver){
        super(activatedRoute, service);
    }
    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    routeTo = (item: OrgNotification) => {this.router.navigate([item.id], {relativeTo: this.activatedRoute.parent}); }

    createNotification = () => this.lookupResolver.notificationCreatePopup(() => { super.populateGrid(); });

    updateNotification = (row: OrgNotification) => this.lookupResolver
        .notificationCreateEditPopup(row,()=> super.populateGrid());

    showScheduler = (row: OrgNotification) => this.lookupResolver.showSchedulerPopup(row, (orgTaskScheduleId) => {
        //row.orgTaskScheduleId = orgTaskScheduleId;
        super.populateGrid();
    });

    showTemplateToCreateEdit = (notificationId, template: NotificationMediaTypeTemplate) => this.lookupResolver
        .notificationTemplateCreateEdit(notificationId, template, () => {
            super.populateGrid();
        });
}
