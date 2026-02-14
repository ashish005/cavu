import {GlobalModule} from "@app-global";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {ConfigLayout} from "./layout/layout";
import {FrequencyTypeView} from "./views/frequency-type.view";
import {WorkflowPhaseStatusView} from "./views/workflow-phase-status.view";
import {TaskPriorityView} from "./views/task-priority.view";
import {TaskStatusTypeView} from "./views/task-status-type.view";
const getTranslationString = (key)=> `master_type.modules.process.${key}`;
export const routes: Routes = [
    {
        path: '', component: ConfigLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'frequency' },
            { path: 'frequency', component: FrequencyTypeView, data: {title: 'Frequency', header: 'Frequency'} },
            { path: 'phase', component: WorkflowPhaseStatusView, data: {title: 'WorkflowPhaseStatus', header: 'WorkflowPhaseStatus' } },
            { path: 'task-priority', component: TaskPriorityView, data: {title: 'TaskPriority', header: 'TaskPriority'} },
            { path: 'task-status', component: TaskStatusTypeView, data: {title: 'TaskStatus', header: 'TaskStatus'} }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
      GlobalModule
    ],
    providers: [],
    declarations: [
      ConfigLayout, FrequencyTypeView, WorkflowPhaseStatusView,
      TaskPriorityView, TaskStatusTypeView
    ]
})

export class ProcessSetupModule {}
