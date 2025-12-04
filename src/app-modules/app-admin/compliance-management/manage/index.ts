import { GlobalModule } from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {COMPLIANCE_VIEWS, ComplianceRoutes} from "./compliance.routing";
import {COMPLIANCE_COMPONENTS} from "./components";
import {
  ComplianceAPIResolver,
  ComplianceDetailService,
  ComplianceRegulatoryService,
  ComplianceService
} from "./services";
import {COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {ReactiveFormsModule} from "@angular/forms";
@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    RouterModule.forChild(ComplianceRoutes),
    GlobalModule
  ],
  providers: [ComplianceAPIResolver, ComplianceService, ComplianceRegulatoryService, ComplianceDetailService],
  declarations: [COMPLIANCE_VIEWS, COMPLIANCE_COMPONENTS, COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS]
})
export class ComplianceManageModule {}
