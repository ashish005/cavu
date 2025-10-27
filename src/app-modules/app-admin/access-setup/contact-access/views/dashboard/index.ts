import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {DASHBOARD_PORTLET_COMPONENTS} from "./components";
import {DashboardPortletView} from "./views/dashboard-portlet.view";
import {DashboardPortletService} from "./services/dashboard-portlet.service";

const MASTER_DASHBOARD_VIEW = [ DashboardPortletView ];

const MasterDashboardRoutes: Array<any> = [
  { path: '', component: DashboardPortletView, data: {title: 'master_type.modules.dashboard.title'} }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MasterDashboardRoutes),
    GlobalModule
  ],
  declarations: [MASTER_DASHBOARD_VIEW, DASHBOARD_PORTLET_COMPONENTS],
  providers: [DashboardPortletService]
})

export class DashboardMasterTypeModule{
  static forRoot(): ModuleWithProviders<DashboardMasterTypeModule> {
    return {
      ngModule: DashboardMasterTypeModule
    };
  }
  static forChild(): ModuleWithProviders<DashboardMasterTypeModule> {
    return {
      ngModule: DashboardMasterTypeModule
    };
  }
}
