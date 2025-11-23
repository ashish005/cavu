import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {COMPLIANCE_REPORT_VIEWS, ComplianceReportRoutes} from "./compliance-report.routing";
import {COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS} from "./grid-cells";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild(ComplianceReportRoutes),
    GlobalModule
  ],
  providers: [],
  declarations: [COMPLIANCE_REPORT_VIEWS, COMPLIANCE_GRID_COLUMN_CELL_COMPONENTS]
})

export class ComplianceReportModule {}
