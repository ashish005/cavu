import {EventTaskSchedulerView} from "./views/event-task-scheduler.view";
import {EventTaskCalendarView} from "./views/event-task-calendar.view";
import {EventTaskReminderView} from "./views/event-task-reminder.view";
import {EventTaskActivityView} from "./views/event-task-activity.view";
import {OrgTaskView} from "./views/org-task.view";
import {OrgTaskCeComponent} from "./views/org-task-ce.component";

export {OrgTaskView} from "./views/org-task.view";
export {OrgTaskCeComponent} from "./views/org-task-ce.component";

export const ORG_TASK_VIEWS = [
    OrgTaskView,
    OrgTaskCeComponent,
    EventTaskCalendarView, EventTaskActivityView, EventTaskReminderView, EventTaskSchedulerView
];
