import {Routes} from "@angular/router";
import {Layout} from "./layout/layout";
import {ProcessView} from "./views/process.view";
import {SchedulerLogView} from "./views/scheduler-log.view";
import {OrgTaskView} from "./views/org-task.view";
import {TaskSummaryView} from "./views/task-summary.view";
import {TaskScheduleView} from "./views/task-schedule.view";
import {DashboardView} from "./views/dashboard.view";
import {TaskCalendarView} from "./views/task-calendar.view";
import {TaskReminderView} from "./views/task-reminder.view";

export const OrgProcessTaskRoutes: Routes = [
  {
    path: '', component: Layout,
    children:[
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', key: 'dashboard', header:'Dashboard'} },
      { path: 'all', component: ProcessView, data: { title: 'Process', key: 'process', header:'process'} },
      { path: 'task', component: OrgTaskView, data: { title: 'Task', key: 'task', header:'task'} },
      { path: 'task-info', component: TaskSummaryView, data: { title: 'Task Info', key: 'task_info', header:'Task Info'} },
      { path: 'scheduled', component: TaskScheduleView, data: { title: 'Schedules', key: 'schedule', header:'Task Schedule'} },
      { path: 'history', component: SchedulerLogView, data: { title: 'Schedule History', key: 'schedule_history', header:'Schedule History'} },
      { path: 'task-calendar', component: TaskCalendarView, data: { title: 'Task Calendar', key: 'calendar', header:'Task Calendar'} },
      { path: 'task-reminder', component: TaskReminderView, data: { title: 'Reminder', key: 'reminder', header:'Task Reminder'} }
    ]
  },
    {
        path: 'task/:taskId', data: { translatePath: 'modules.project.sub_module' },
        loadChildren: () => import('app-modules/core-modules/org-process/task-by-id').then(m => m.TaskByIdModule)
    },
];
export const ORG_PROCESS_TASK_VIEWS = [ Layout,
    DashboardView,
    ProcessView, OrgTaskView,
    TaskSummaryView, TaskScheduleView, SchedulerLogView,
    TaskCalendarView, TaskReminderView
];
