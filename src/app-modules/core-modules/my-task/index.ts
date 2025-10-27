import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";
import {MY_TASK_VIEWS, MyTaskRoutes} from "./my-task.routing";
import {MyTaskAPIResolver} from "./services/api.resolver";
import {MyTaskService} from "./services/my-task.service";
import {MyTaskScheduleService} from "./services/my-task-scheduler.service";
import {MyTaskReminderService} from "./services/my-task-reminder.service";
import {MyCalendarService} from "./services/my-calendar.service";
import {MY_TASK_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {MY_TASK_COMPONENTS} from "./components";
import {MyTaskSchedulerLogService} from "./services/my-task-scheduler-log.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MyTaskRoutes),
        GlobalModule
    ],
    providers: [
        MyTaskAPIResolver,
        MyTaskService, MyTaskScheduleService, MyTaskReminderService, MyCalendarService, MyTaskSchedulerLogService
    ],
    declarations: [MY_TASK_VIEWS, MY_TASK_GRID_COLUMN_CELL_COMPONENTS, MY_TASK_COMPONENTS]
})

export class MyTaskModule{}
