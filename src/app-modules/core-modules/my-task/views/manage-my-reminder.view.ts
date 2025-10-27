import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {MyTaskAPIResolver} from "../services/api.resolver";
import {MyTaskReminderService} from "../services/my-task-reminder.service";
import {MyTaskReminder, MyTaskReminderQueryOptions} from "../domains/my-task/my-task-reminder.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/my-reminder.html'
})
export class ManageMyReminderView extends ViewExtender<MyTaskReminder> implements OnInit, OnDestroy {
  override coreState: MyTaskReminderQueryOptions = new MyTaskReminderQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: MyTaskReminderService,
                public apiResolver: MyTaskAPIResolver)
    {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'Task', field: 'orgTaskName'},
            {headerName: 'Notification', field: 'notificationName'},
            {headerName: 'Notification Type', field: 'notificationTypeName'},
        ];
    }

    //onActivate(componentRef){ super.actionTemplate = componentRef.actionTemplate; }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){
        //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
        // (<MyTaskReminderQueryOptions>this.coreState).orgUserId = this.coreService.currentUser.id;
      super.populateGrid();
    }

    actionCb(data: MyTaskReminder){
        const { id, orgTaskName, notificationId, orgTaskScheduleId, userGroupId,frequencyType, reminderValue } = data;
        const inputData = {
            id: id,
            data: {
                orgTaskScheduleId: orgTaskScheduleId,
                userGroupId: userGroupId,
                notificationId: notificationId,
                frequencyType: frequencyType,
                reminderValue: reminderValue
            }
        };
        const popupHeaderOption = {
            text: `Reminder for ${orgTaskName}`,
            desc: `Reminder will be send to user prior to scheduled time`
        };
        this.apiResolver.showOrgTaskReminderCEPopup(inputData, popupHeaderOption);
    }
}
