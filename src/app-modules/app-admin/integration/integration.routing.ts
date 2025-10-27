import {Routes} from "@angular/router";
import {IntegrationLayout} from "./layout/layout";
import {ApiConnectorView} from "./views/api-connector.view";
import {OrgIntegrationView} from "./views/org-integration.view";
import {OrgIntegrationAPIResolver} from "./services/api.resolver";
import {OrgOtherIntegrationView} from "./views/org-other-integration.view";

const getTranslationString = (key)=> `master_type.modules.integration.${key}`;
export const IntegrationRoutes: Routes = [
    {
        path: '', component: IntegrationLayout, resolve: { items: OrgIntegrationAPIResolver }, data: { title: 'Manage Integration', header: 'Manage Integration'},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'test' },
            { path: 'test', data: {title: getTranslationString('conference.title'), header: getTranslationString('conference.header')}, component: ApiConnectorView },
            { path: 'email', component: OrgIntegrationView, data: {title: 'Email Configs'} },
            { path: 'sms', component: OrgIntegrationView, data: {title: 'Sms Configs'} },
            { path: 'accounting', component: OrgOtherIntegrationView, data: {title: 'Accounting Configs'} },
            { path: 'shipping', component: OrgOtherIntegrationView, data: {title: 'Shipping Configs'} },
            { path: 'currencyExchange', component: OrgOtherIntegrationView, data: {title: 'Currency Exchange'} },
            { path: 'edi', component: OrgOtherIntegrationView, data: {title: 'EDI'} },
            { path: 'payment', component: OrgOtherIntegrationView, data: {title: 'Payments'} },
            { path: 'collaboration', component: OrgOtherIntegrationView, data: {title: 'Collaborations'} },
            { path: 'conference', component: OrgOtherIntegrationView, data: {title: 'Video conference'} }
        ]
    }
];
export const INTEGRATION_VIEWS = [ IntegrationLayout, ApiConnectorView, OrgIntegrationView, OrgOtherIntegrationView ];