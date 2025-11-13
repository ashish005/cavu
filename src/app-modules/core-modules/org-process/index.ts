import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
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
                        path: 'setup', //canLoad:[ModuleGuard],
                        loadChildren: () => import('app-modules/core-modules/org-process/setup').then(m => m.ProcessSetupModule),
                        data: {title: 'Process', header:'Process', name: "Process", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
                    },
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [],
    declarations: []
})
export class ProcessModule{}
