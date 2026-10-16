import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {ORG_ADMIN_SERVICES} from "./services/org-admin-api.service";
import {OrgBrandingView, OrgFeaturesView, OrgProfileView, OrgSettingsView} from "./views/org-pages.view";
import {OrgMembersView, OrgRoleEditorComponent, OrgRolesView} from "./views/access.view";
import {OrgIntegrationActivityView, OrgIntegrationEditorComponent, OrgIntegrationsView} from "./views/integrations.view";
import {OrgBranchesView, OrgHostsView, OrgMemberTypesView, OrgRequirementsView} from "./views/structure.view";
import {OrgDashboardsView} from "./views/dashboards.view";

/**
 * Organisation administration on the tenant API `api/v1/org-admin/*`: profile, regional settings, branding, features,
 * roles and permissions, members' roles, and third-party integrations (messaging, payment gateways, webhooks).
 * Mounted under `app/admin/setup`; the API checks each caller's permission.
 */
export const ORG_ADMIN_ROUTES: Routes = [
    {path: 'org/profile', component: OrgProfileView, data: {title: 'Organisation profile', header: 'Organisation profile'}},
    {path: 'org/settings', component: OrgSettingsView, data: {title: 'Regional settings', header: 'Regional settings'}},
    {path: 'org/branding', component: OrgBrandingView, data: {title: 'Branding', header: 'Branding'}},
    {path: 'org/features', component: OrgFeaturesView, data: {title: 'Features', header: 'Features'}},
    {path: 'org/branches', component: OrgBranchesView, data: {title: 'Branches', header: 'Branches'}},
    {path: 'org/hosts', component: OrgHostsView, data: {title: 'Host names', header: 'Host names'}},
    {path: 'access/member-types', component: OrgMemberTypesView, data: {title: 'Member types', header: 'Member types'}},
    {path: 'access/dashboards', component: OrgDashboardsView, data: {title: 'Dashboards', header: 'Dashboards'}},
    {path: 'access/requirements', component: OrgRequirementsView, data: {title: 'Member requirements', header: 'Member requirements'}},
    {path: 'access/roles', component: OrgRolesView, data: {title: 'Roles and permissions', header: 'Roles and permissions'}},
    {path: 'access/members', component: OrgMembersView, data: {title: 'Members and roles', header: 'Members and roles'}},
    {path: 'integrations/messaging', component: OrgIntegrationsView, data: {page: 'messaging', title: 'Messaging', header: 'Messaging'}},
    {path: 'integrations/payments', component: OrgIntegrationsView, data: {page: 'payments', title: 'Payment gateways', header: 'Payment gateways'}},
    {path: 'integrations/webhooks', component: OrgIntegrationsView, data: {page: 'webhooks', title: 'Webhooks', header: 'Webhooks'}},
    {path: 'integrations/activity', component: OrgIntegrationActivityView, data: {title: 'Integration activity', header: 'Integration activity'}}
];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(ORG_ADMIN_ROUTES), GlobalModule, AsidePanelComponent],
    providers: [ORG_ADMIN_SERVICES],
    declarations: [
        OrgProfileView, OrgSettingsView, OrgBrandingView, OrgFeaturesView,
        OrgRolesView, OrgRoleEditorComponent, OrgMembersView,
        OrgIntegrationsView, OrgIntegrationEditorComponent, OrgIntegrationActivityView,
        OrgBranchesView, OrgHostsView, OrgMemberTypesView, OrgRequirementsView, OrgDashboardsView
    ]
})
export class OrgAdminModule {}
