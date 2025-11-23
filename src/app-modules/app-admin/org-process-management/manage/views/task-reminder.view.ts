import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {PipelineAPIResolver} from "../resolver/api.resolver";
import {TaskReminder, TaskReminderQueryOptions} from "../domains/task-reminder.serializer";
import { TaskReminderService } from "../services/task-reminder.service";
import {
    ReminderGroupActionCell,
    ReminderNameActionCell, ReminderNotificationActionCell,
    TaskReminderScheduleRunCell
} from "../grid-cells/task-reminder-grid-cell.component";
import { ViewExtender } from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/task-reminder.html'
})
export class TaskReminderView extends ViewExtender<TaskReminder> implements OnInit, OnDestroy {
  override coreState :TaskReminderQueryOptions = new TaskReminderQueryOptions();
    constructor(public override service: TaskReminderService,
                public router: Router,
                public override activatedRoute: ActivatedRoute,
                public lookupResolver: PipelineAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name', cellTemplate: ReminderNameActionCell },
            {headerName: 'Group', field: 'lastRunLog', cellTemplate: ReminderGroupActionCell },
            {headerName: 'Notification', field: 'lastRunLog', cellTemplate: ReminderNotificationActionCell },
            {headerName: 'Last Run', field: 'lastRunLog', cellTemplate: TaskReminderScheduleRunCell },
            {headerName: 'Next Run', field: 'nextRunLog', cellTemplate: TaskReminderScheduleRunCell }
        ];
    }

    onActivate(componentRef){
      this.actionTemplate = componentRef.actionTemplate;
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){
        //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
      super.populateGrid();
    }

    actionCb(data: TaskReminder){
        /*const { id, orgTaskName, notificationId, orgTaskScheduleId, userGroupId,frequencyType, reminderValue } = data;
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
        this.lookupResolver.showOrgTaskReminderCEPopup(inputData, popupHeaderOption);*/
    }
}
