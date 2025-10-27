import {Routes} from "@angular/router";

export const SettingAccessSetupRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    // {
    //     path: 'notification',
    //     loadChildren: () => import('app-common/notification').then(m => m.NotificationModule),
    //     data: { code: "ACCESS_NOTIFY_MGT", hideHeader: true }
    // },
    { path: 'dashboard', loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views/dashboard').then(m => m.DashboardMasterTypeModule), data: { code: "ACCESS_DASHBRD_MGT"} },
    { path: 'document-type', loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views/document-type').then(m => m.DocumentMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
    { path: 'address-type', loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views/address-type').then(m => m.AddressMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
    { path: 'contact-type', loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views/contact-type').then(m => m.ContactMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
    { path: 'relation-type', loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views/relation-type').then(m => m.RelationMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} }
];
