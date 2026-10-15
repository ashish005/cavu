import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {moduleGuard} from "app/global/services/orgwise/entitlement/module.guard";
import {PartyLayout} from "./layout/layout";
import {PartyViewsModule} from "./party-views.module";
import {PartyListView} from "./views/party-list.view";
import {PartyDetailView} from "./views/party-detail.view";
import {AgingView, Form1099View} from "./views/reports.view";
import {PartySettingsView} from "./views/settings.view";

/** Admin area for customers, vendors and employees, with reports and settings; each role gated by its module. See README.md. */
const roleRoutes = (path: string, role: string, module: string, title: string) => [
    {path, component: PartyListView, canMatch: [moduleGuard], data: {role, module, title, key: path, header: title}},
    {path: `${path}/:id`, component: PartyDetailView, canMatch: [moduleGuard], data: {role, module, title, key: path, header: title}}
];

const routes: Routes = [
    {
        path: '', component: PartyLayout,
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'customers'},
            ...roleRoutes('customers', 'customer', 'FIN', 'Customers'),
            ...roleRoutes('vendors', 'vendor', 'VEN', 'Vendors'),
            ...roleRoutes('employees', 'employee', 'EMP', 'Employees'),
            {path: 'aging', component: AgingView, data: {title: 'Aging', key: 'aging', header: 'Aging'}},
            {path: '1099', component: Form1099View, canMatch: [moduleGuard], data: {module: 'VEN', title: '1099 summary', key: '1099', header: '1099'}},
            {path: 'settings', component: PartySettingsView, data: {title: 'Settings', key: 'settings', header: 'Settings'}},
            {path: '**', redirectTo: 'customers'}
        ]
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes), GlobalModule, AsidePanelComponent, PartyViewsModule],
    declarations: [PartyLayout, AgingView, Form1099View, PartySettingsView]
})
export class PartyManageModule {}
