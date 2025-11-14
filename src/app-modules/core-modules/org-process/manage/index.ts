import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";
import {ORG_PROCESS_TASK_VIEWS, OrgProcessTaskRoutes} from "./process.routing";
import {PipelineAPIResolver} from "./resolver/api.resolver";
import {PIPELINE_PROCESS_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {ORG_PROCESS_SERVICE} from "./services";
import {PROCESS_COMPONENTS} from "./components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(OrgProcessTaskRoutes),
    GlobalModule
  ],
  providers: [ PipelineAPIResolver, ORG_PROCESS_SERVICE ],
  declarations: [ ORG_PROCESS_TASK_VIEWS, PIPELINE_PROCESS_GRID_COLUMN_CELL_COMPONENTS, PROCESS_COMPONENTS],
})

export class ProcessManageModule{}
