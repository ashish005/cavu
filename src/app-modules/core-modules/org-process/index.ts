import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CoreModule, ModuleGuard} from "@app-global";

@Component({ templateUrl: './layout.html' })
export class ProcessLayout {
    public navList = [
        { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' },
        { routeTo: ['workflow'], icon:"fa fa-dashboard", key: 'Workflow' },
        { routeTo: ['all'], icon:"fa fa-envelope", key: 'Processes' },
        { routeTo: ['task'], icon:"fa fa-envelope", key: 'Tasks' },
        { routeTo: ['task-info'], icon:"fa fa-envelope", key: 'Task Runner' },
        { routeTo: ['scheduled'], icon:"fa fa-bell", key: 'Task Schedule' },
        { routeTo: ['task-reminder'], icon:"fa fa-bell", key: 'mainLayout.reminder' },
        { routeTo: ['task-calendar'], icon:"fa fa-bell", key: 'mainLayout.calendar' },
        { routeTo: ['history'], icon:"fa fa-bell", key: 'History' },
        { routeTo: ['setup'], icon:"fa fa-bell", key: 'Setup' }
    ];
    constructor(){}
    onActivate(componentRef){}
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: ProcessLayout,
                children: [
                    {
                        path: '', data: { translatePath: 'modules.project.manage' },
                        loadChildren: () => import('app-modules/core-modules/org-process/manage').then(m => m.ProcessManageModule)
                    },
                    {
                        path: 'task/:taskId', data: { translatePath: 'modules.project.sub_module' },
                        loadChildren: () => import('app-modules/core-modules/org-process/task-by-id').then(m => m.TaskByIdModule)
                    },
                    {
                        path: 'workflow', data: { translatePath: 'modules.project.sub_module' },
                        loadChildren: () => import('app-modules/core-modules/org-process/workflow').then(m => m.ProcessWorkflowModule)
                    },
                    {
                        path: 'setup', canLoad:[ModuleGuard],
                        loadChildren: () => import('app-modules/core-modules/org-process/setup').then(m => m.ProcessSetupModule),
                        data: {title: 'Process', header:'Process', name: "Process", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
                    },
                ]
            }
        ]),
        CoreModule.forChild()
    ],
    providers: [],
    declarations: [ProcessLayout]
})
export class ProcessModule{}
