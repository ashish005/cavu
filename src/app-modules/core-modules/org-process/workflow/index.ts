import {GlobalModule} from "@app-global";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PROCESS_WORKFLOW_COMPONENTS} from "./components";
import {ProcessWorkflowView} from "./views/workflow.view";
import {Layout, SubLayout} from "./layouts/layout";
import {AdvanceWorkflowView} from "./views/advance-workflow.view";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: Layout,
                data: { title: 'modules.notification.title', desc:'modules.notification.desc'},
                children: [
                    {
                        path: ':processId', component: SubLayout,
                        data: { title: 'modules.notification.title', desc:'modules.notification.desc'},
                        children: [
                            { path: '', component: ProcessWorkflowView },
                            { path: 'advanced', component: AdvanceWorkflowView },
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    declarations: [ProcessWorkflowView, AdvanceWorkflowView, Layout, SubLayout, PROCESS_WORKFLOW_COMPONENTS]
})
export class ProcessWorkflowModule{}
