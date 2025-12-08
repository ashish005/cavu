import {Routes} from "@angular/router";
import {MyTaskLayout} from "./layout/layout";
import {ManageMyTaskView} from "./views/manage-my-task.view";
import {ManageMyScheduledTaskView} from "./views/manage-my-scheduled-task.view";
import {ManageMyCalendarView} from "./views/manage-my-calendar.view";
import {ManageMyReminderView} from "./views/manage-my-reminder.view";
import {MyTaskDashboardView} from "./views/my-task-dashboard.view";
import {ManageMyTaskBoardView} from "./views/my-task/manage-my-task-board.view";
import {ManageMyCalendarTaskView} from "./views/my-task/manage-my-calendar-task.view";
import {
    CALENDAR_VIEWS,
    MyCalendarDayTaskView,
    MyCalendarMonthTaskView,
    MyCalendarTimelineTaskView, MyCalendarWeekTaskView, MyCalendarYearTaskView
} from "./views/my-task/calendar";
import {ManageMyScheduledTaskLogView} from "./views/manage-my-scheduled-task-log.view";

export const MyTaskRoutes: Routes = [
  {
    path: '', component: MyTaskLayout, data: { key: 'task', title: ''},
    children: [
        { path: '', pathMatch: 'full', redirectTo:'org' },
        { path: 'dashboard', component: MyTaskDashboardView, data: { key: 'task', title: 'Dashboard'} },
        { path: 'org', data: { title: '', header: 'Task'},
            children: [
                {path: '', pathMatch: 'full', redirectTo: 'list'},
                {path: 'list', component: ManageMyTaskView, data: {key: 'task', title: 'Manage My Task'}},
                {path: 'board', component: ManageMyTaskBoardView, data: {key: 'task', title: 'Manage My Task'}},
                { path: 'calendar', component: ManageMyCalendarTaskView, data: { key: 'project', title: 'Manage My Task'},
                    children:[
                        { path: '', pathMatch: 'full', redirectTo:'day' },
                        { path: 'day', component: MyCalendarDayTaskView, data: { key: 'project', title: 'Manage My Task'} },
                        { path: 'month', component: MyCalendarMonthTaskView, data: { key: 'project', title: 'Manage My Task'} },
                        { path: 'timeline', component: MyCalendarTimelineTaskView, data: { key: 'project', title: 'Manage My Task'} },
                        { path: 'week', component: MyCalendarWeekTaskView, data: { key: 'project', title: 'Manage My Task'} },
                        { path: 'year', component: MyCalendarYearTaskView, data: { key: 'project', title: 'Manage My Task'} }
                    ]
                }
            ]
        },
        { path: 'scheduled', component: ManageMyScheduledTaskView, data: { title: 'Task Scheduler', header: 'Scheduled Task'}},
        { path: 'task-log', component: ManageMyScheduledTaskLogView, data: { title: 'Task Logs', header: 'Task Logs'}},
        { path: 'reminder', component: ManageMyReminderView, data: { title: 'Task reminder', header: 'Reminder'}},
        { path: 'calendar', component: ManageMyCalendarView },
        //{ path: 'project', component: ManageMyProjectTaskView,
          // children:
          //     [
          //         { path: '', pathMatch: 'full', redirectTo:'list' },
          //         { path: 'list', component: ManageMyTaskListView, data: { key: 'project', title: 'Manage My Task'} },
          //         { path: 'board', component: ManageMyTaskBoardView, data: { key: 'project', title: 'Manage My Task'} },
          //         { path: 'calendar', component: ManageMyCalendarTaskView, data: { key: 'project', title: 'Manage My Task'},
          //             children:[
          //                 { path: '', pathMatch: 'full', redirectTo:'day' },
          //                 { path: 'day', component: MyCalendarDayTaskView, data: { key: 'project', title: 'Manage My Task'} },
          //                 { path: 'month', component: MyCalendarMonthTaskView, data: { key: 'project', title: 'Manage My Task'} },
          //                 { path: 'timeline', component: MyCalendarTimelineTaskView, data: { key: 'project', title: 'Manage My Task'} },
          //                 { path: 'week', component: MyCalendarWeekTaskView, data: { key: 'project', title: 'Manage My Task'} },
          //                 { path: 'year', component: MyCalendarYearTaskView, data: { key: 'project', title: 'Manage My Task'} }
          //             ]
          //         },
          //         { path: 'discussions', component: ManageMyTaskBoardView, data: {title: 'discussions'} },
          //         { path: 'gantt', component: ManageMyTaskBoardView, data: {title: 'Gantt'} },
          //         { path: 'goals', component: ManageMyTaskBoardView, data: {title: 'Goals'} },
          //         { path: 'flows', component: ManageMyTaskBoardView, data: {title: 'Flows'} }
          //     ]
      //}
    ]
  }
];

export const MY_TASK_VIEWS = [
    MyTaskLayout,
    ManageMyTaskView, ManageMyScheduledTaskView, ManageMyCalendarView, ManageMyReminderView, ManageMyScheduledTaskLogView,
    ManageMyTaskBoardView, ManageMyCalendarTaskView,
    CALENDAR_VIEWS
    //ManageMyTaskListView, ManageMyTaskBoardView, ManageMyCalendarTaskView, MyCalendarDayTaskView, MyCalendarMonthTaskView, MyCalendarTimelineTaskView, MyCalendarWeekTaskView, MyCalendarYearTaskView
];
