import {Routes} from "@angular/router";
import {OrgWorkflowAPIResolver} from "@app-global";
import {Layout} from "./layout/layout";
import {OrgWorkflowView} from "./views/workflow.view";
import {WorkflowGridView} from "./views/workflow-grid.view";

export const OrgProcessTaskRoutes: Routes = [
  {
    path: '', component: Layout, resolve: { lookup: OrgWorkflowAPIResolver },
    children:[
      { path: '', pathMatch: 'full', redirectTo:'tree' },
      { path: 'grid', component: WorkflowGridView, data: { title: 'Process', key: 'process', header:'process'} },
      { path: 'tree', component: OrgWorkflowView, data: { title: 'Process', key: 'process', header:'process'} }
    ]
  }
];
export const ORG_WORKFLOW_VIEWS = [
    Layout,
    OrgWorkflowView, WorkflowGridView
];
