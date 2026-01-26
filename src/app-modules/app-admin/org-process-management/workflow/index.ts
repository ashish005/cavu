import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule, GRID_COMPONENT} from "@app-global";
import {RouterLink, RouterLinkActive, RouterModule} from "@angular/router";

import {WORKFLOW_COMPONENTS} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ORG_WORKFLOW_VIEWS, OrgProcessTaskRoutes} from "./workflow.routing";
import {FilterTransitionsByFromPipe, FindPhaseStatusesPipe} from "./pipes";
import {OrgWorkflowPhaseService, OrgWorkflowPhaseStepTaskService, WorkflowService} from "./services/workflow.service";
import {WORKFLOW_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(OrgProcessTaskRoutes),
    GlobalModule
  ],
  providers: [ WorkflowService, OrgWorkflowPhaseService, OrgWorkflowPhaseStepTaskService ],
  declarations: [ ORG_WORKFLOW_VIEWS, WORKFLOW_COMPONENTS, WORKFLOW_GRID_COLUMN_CELL_COMPONENTS, FilterTransitionsByFromPipe, FindPhaseStatusesPipe ],
})

export class WorkflowManageModule{}
