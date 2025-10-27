import {GlobalModule} from "@app-global";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {ConfigLayout} from "./layout/layout";
import {FrequencyTypeView} from "./views/frequency-type.view";
import {ProcessPhaseView} from "./views/process-phase.view";
import {TaskPriorityView} from "./views/task-priority.view";
import {TaskStatusTypeView} from "./views/task-status-type.view";

const getTranslationString = (key)=> `master_type.modules.process.${key}`;
export const routes: Routes = [
    {
        path: '', component: ConfigLayout,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'frequency' },
            { path: 'frequency', component: FrequencyTypeView, data: {title: getTranslationString('frequency.type.title'), header: getTranslationString('frequency.type.header')} },
            { path: 'phase', component: ProcessPhaseView, data: {title: getTranslationString('frequency.type.title'), header: getTranslationString('frequency.type.header')} },
            { path: 'task-priority', component: TaskPriorityView, data: {title: getTranslationString('frequency.type.title'), header: getTranslationString('frequency.type.header')} },
            { path: 'task-status', component: TaskStatusTypeView, data: {title: getTranslationString('frequency.type.title'), header: getTranslationString('frequency.type.header')} }
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
      ConfigLayout, FrequencyTypeView, ProcessPhaseView,
      TaskPriorityView, TaskStatusTypeView
    ]
})

export class ProcessSetupModule {}
