import {OrgProcessService, OrgProcessTrackerService} from "./org-process.service";
import {OrgTaskService, OrgTaskSummaryService} from "./org-process-task.service";
import {OrgProcessWorkflowService} from "./org-process-workflow.service";
import {SchedulerLogService} from "./scheduler-log.service";
import {SchedulerService} from "./scheduler.service";
import {TaskCalendarService} from "./task-calendar.service";
import {TaskReminderService} from "./task-reminder.service";

export const ORG_PROCESS_SERVICE = [
    OrgProcessWorkflowService, OrgProcessService, OrgProcessTrackerService,
    OrgTaskSummaryService, OrgTaskService,
    SchedulerService, SchedulerLogService,
    TaskCalendarService, TaskReminderService
];