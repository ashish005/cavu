import { GlobalModule } from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {COMPLIANCE_VIEWS, ComplianceRoutes} from "./compliance.routing";
import {COMPLIANCE_COMPONENTS} from "./components";
import {ComplianceAPIResolver, ComplianceRegulatoryService, ComplianceService} from "./services";
import {COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComplianceRoutes),
    GlobalModule
  ],
  providers: [ComplianceAPIResolver, ComplianceService, ComplianceRegulatoryService],
  declarations: [COMPLIANCE_VIEWS, COMPLIANCE_COMPONENTS, COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS]
})

export class ComplianceManageModule {}
