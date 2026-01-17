import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {WorkflowManageModule} from "./workflow";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: '', data: { translatePath: 'modules.project.manage' },
                        loadChildren: () => import('app-modules/app-admin/org-process-management/manage').then(m => m.ProcessManageModule)
                    },
                    {
                        path: 'master', data: { translatePath: 'modules.project.manage' },
                        loadChildren: () => import('app-modules/app-admin/org-process-management/workflow').then(m => m.WorkflowManageModule)
                    },
                    {
                        path: 'setup', //canLoad:[ModuleGuard],
                        loadChildren: () => import('app-modules/app-admin/org-process-management/setup').then(m => m.ProcessSetupModule),
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
