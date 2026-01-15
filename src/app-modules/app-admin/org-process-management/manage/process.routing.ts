import {Routes} from "@angular/router";
import {Layout} from "./layout/layout";
import {ProcessView} from "./views/process.view";
import {SchedulerLogView} from "./views/scheduler-log.view";
import {OrgTaskView} from "./views/org-task.view";
import {TaskRunnerView} from "./views/task-runner.view";
import {TaskScheduleView} from "./views/task-schedule.view";
import {DashboardView} from "./views/dashboard.view";
import {TaskCalendarView} from "./views/task-calendar.view";
import {TaskReminderView} from "./views/task-reminder.view";
import {ProcessTreeView} from "./views/process-tree.view";
import {OrgWorkflowAPIResolver} from "@app-global";
import {ProcessBoardView} from "./views/process-board.view";

export const OrgProcessTaskRoutes: Routes = [
  {
    path: '', component: Layout, resolve: { lookup: OrgWorkflowAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'dashboard' },
      { path: 'dashboard', component: DashboardView, data: { title: 'Dashboard', key: 'dashboard', header:'Dashboard'} },
      { path: 'all', component: ProcessView, data: { title: 'Process', key: 'process', header:'process'} },
      { path: 'tree', component: ProcessTreeView, data: { title: 'Process', key: 'process', header:'process'} },
      //{ path: 'board', component: ProcessBoardView, data: { title: 'Process', key: 'process', header:'process'} },
      { path: 'task', component: OrgTaskView, data: { title: 'Task', key: 'task', header:'task'} },
      { path: 'task-runner', component: TaskRunnerView, data: { title: 'Task Info', key: 'task_info', header:'Task Info'} },
      { path: 'scheduled', component: TaskScheduleView, data: { title: 'Schedules', key: 'schedule', header:'Task Schedule'} },
      { path: 'history', component: SchedulerLogView, data: { title: 'Schedule History', key: 'schedule_history', header:'Schedule History'} },
      { path: 'task-calendar', component: TaskCalendarView, data: { title: 'Task Calendar', key: 'calendar', header:'Task Calendar'} },
      { path: 'task-reminder', component: TaskReminderView, data: { title: 'Reminder', key: 'reminder', header:'Task Reminder'} }
    ]
  },
    {
        path: 'board',
        data: { title: 'Process', key: 'process', header:'process'},
        component: ProcessBoardView,
        resolve: {lookup: OrgWorkflowAPIResolver}
    }
];
export const ORG_PROCESS_TASK_VIEWS = [ Layout,
    DashboardView,
    ProcessView, ProcessTreeView, ProcessBoardView,
    OrgTaskView,
    TaskRunnerView, TaskScheduleView, SchedulerLogView,
    TaskCalendarView, TaskReminderView
];
