import {Routes} from "@angular/router";
import {TaskSideNavLayout} from "./layout/layout";
import {TaskDashboardView} from "./views/dashboard.view";
import {TaskAPIResolver, TaskByIdAPIResolver} from "./services/api.resolver";
import {ScheduleView} from "./views/schedule.view";
import {ReminderView} from "./views/reminder.view";

const translatePath = 'modules.project.sub_module';

export const TaskByIdRoutes: Routes = [
    {
        path: '',
        resolve: { lookup: TaskAPIResolver, data: TaskByIdAPIResolver },
        component: TaskSideNavLayout, data: { code:'', icon: 'fa fa-dashboard', title: `modules.project.title`, header: `modules.project.header` },
        runGuardsAndResolvers: 'paramsChange',
        children:[
            { path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: TaskDashboardView, data: { code:'', icon: 'fa fa-dashboard', title: `${translatePath}.dashboard.title`, header: `${translatePath}.dashboard.header` } },
            { path: 'schedules', component: ScheduleView, data: { title: 'Schedules', key: 'schedule', header:'Task Schedule'} },
            { path: 'reminder', component: ReminderView, data: { title: 'Reminder', key: 'reminder', header:'Task Reminder'} }
        ]
    }
];

export const TASK_BY_ID_VIEWS = [TaskSideNavLayout, TaskDashboardView, ScheduleView, ReminderView];
