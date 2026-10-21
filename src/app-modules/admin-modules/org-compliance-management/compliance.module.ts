import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {ComplianceLayout} from "./layout/layout";
import {ComplianceApiService} from "./services/compliance-api.service";
import {ComplianceDashboardView} from "./views/dashboard.view";
import {ComplianceTasksView} from "./views/tasks.view";
import {ComplianceCalendarView} from "./views/calendar.view";
import {ComplianceObligationsView} from "./views/obligations.view";
import {ComplianceSetupView} from "./views/setup.view";
import {ComplianceRegistrationsView} from "./views/registrations.view";
import {ComplianceReportView} from "./views/report.view";
import {ComplianceTaskPanelComponent} from "./components/task-panel.component";
import {ObligationEditorComponent} from "./components/obligation-editor.component";

/** Compliance: obligations from the global catalog, their periodic tasks, licences and registrations. See README.md. */
const routes: Routes = [
    {
        path: '', component: ComplianceLayout,
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
            {path: 'dashboard', component: ComplianceDashboardView, data: {title: 'Dashboard', key: 'dashboard', header: 'Dashboard'}},
            {path: 'tasks', component: ComplianceTasksView, data: {title: 'Tasks', key: 'tasks', header: 'Tasks'}},
            {path: 'calendar', component: ComplianceCalendarView, data: {title: 'Calendar', key: 'calendar', header: 'Calendar'}},
            {path: 'registrations', component: ComplianceRegistrationsView, data: {title: 'Licences & registrations', key: 'registrations', header: 'Licences & registrations'}},
            {path: 'report', component: ComplianceReportView, data: {title: 'Report', key: 'report', header: 'Report'}},
            {path: 'obligations', component: ComplianceObligationsView, data: {title: 'Obligations', key: 'obligations', header: 'Obligations'}},
            {path: 'setup', component: ComplianceSetupView, data: {title: 'Profile & catalog', key: 'setup', header: 'Profile & catalog'}},
            {path: '**', redirectTo: 'dashboard'}
        ]
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes), GlobalModule, AsidePanelComponent],
    providers: [ComplianceApiService],
    declarations: [
        ComplianceLayout, ComplianceDashboardView, ComplianceTasksView, ComplianceCalendarView, ComplianceObligationsView, ComplianceSetupView,
        ComplianceRegistrationsView, ComplianceReportView, ComplianceTaskPanelComponent, ObligationEditorComponent
    ]
})
export class ComplianceManageModule {}
