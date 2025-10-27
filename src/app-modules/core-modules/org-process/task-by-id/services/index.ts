import {TaskAPIResolver, TaskByIdAPIResolver} from "./api.resolver";
import {SchedulerService} from "./scheduler.service";
import {TaskReminderService} from "./task-reminder.service";

export const TASK_SERVICES = [
    TaskAPIResolver, TaskByIdAPIResolver,
    SchedulerService, TaskReminderService
];