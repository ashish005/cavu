import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {GlobalModule} from "@app-global";
import {ProcessLayout} from "./layout/layout";
import {ProcessApiService} from "./services/process-api.service";
import {TasksView} from "./views/tasks.view";
import {ProcessesView} from "./views/processes.view";
import {ProcessDetailView} from "./views/process-detail.view";
import {WorkflowsView} from "./views/workflows.view";
import {WorkflowEditorView} from "./views/workflow-editor.view";
import {SchedulesView} from "./views/schedules.view";
import {ScheduleEditorView} from "./views/schedule-editor.view";
import {CalendarView} from "./views/calendar.view";
import {TaskPanelComponent} from "./components/task-panel.component";
import {ZonedPipe} from "./components/zoned.pipe";
import {ConditionBuilderComponent} from "./components/condition-builder.component";
import {TriggersView} from "./views/triggers.view";
import {EventsView} from "./views/events.view";
import {TeamsView} from "./views/teams.view";
import {NotifyEditorComponent} from "./components/notify-editor.component";

/** Processes, tasks, workflows and schedules. See README.md. */
const routes: Routes = [
    {
        path: '', component: ProcessLayout,
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'tasks'},
            {path: 'tasks', component: TasksView, data: {title: 'My tasks', key: 'tasks', header: 'My tasks'}},
            {path: 'processes', component: ProcessesView, data: {title: 'Processes', key: 'processes', header: 'Processes'}},
            {path: 'processes/:id', component: ProcessDetailView, data: {title: 'Process', key: 'process', header: 'Process'}},
            {path: 'calendar', component: CalendarView, data: {title: 'Calendar', key: 'calendar', header: 'Calendar'}},
            {path: 'workflows', component: WorkflowsView, data: {title: 'Workflows', key: 'workflows', header: 'Workflows'}},
            {path: 'workflows/new', component: WorkflowEditorView, data: {title: 'New workflow', key: 'workflow', header: 'Workflow'}},
            {path: 'workflows/:id', component: WorkflowEditorView, data: {title: 'Workflow', key: 'workflow', header: 'Workflow'}},
            {path: 'schedules', component: SchedulesView, data: {title: 'Schedules', key: 'schedules', header: 'Schedules'}},
            {path: 'schedules/new', component: ScheduleEditorView, data: {title: 'New schedule', key: 'schedule', header: 'Schedule'}},
            {path: 'schedules/:id', component: ScheduleEditorView, data: {title: 'Schedule', key: 'schedule', header: 'Schedule'}},
            {path: 'triggers', component: TriggersView, data: {title: 'Triggers', key: 'triggers', header: 'Triggers'}},
            {path: 'teams', component: TeamsView, data: {title: 'Teams', key: 'teams', header: 'Teams'}},
            {path: 'events', component: EventsView, data: {title: 'Event log', key: 'events', header: 'Event log'}},
            {path: '**', redirectTo: 'tasks'}
        ]
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes), GlobalModule],
    providers: [ProcessApiService],
    declarations: [
        ProcessLayout, TasksView, ProcessesView, ProcessDetailView, WorkflowsView, WorkflowEditorView,
        SchedulesView, ScheduleEditorView, CalendarView, TriggersView, EventsView, TeamsView, TaskPanelComponent, ConditionBuilderComponent, NotifyEditorComponent, ZonedPipe
    ]
})
export class ProcessManageModule {}
