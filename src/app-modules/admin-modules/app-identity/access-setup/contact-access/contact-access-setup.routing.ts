import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {UserAccessSetupAPIResolver} from "./services/api.resolver";
export const User_Acccess_Setup_Routes: Routes = [
    {
        path: '', data: { title: 'User Acccess Setup', header:'User Acccess Setup'},
        component: Layout, resolve: { items: UserAccessSetupAPIResolver },
        children: [
            // { path: '', pathMatch: 'full', redirectTo: "EMPLOYEE" },
            // { path: "**", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "EMPLOYEE" } },
            // { path: "CLIENT", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "CLIENT" } },
            // { path: "VENDOR", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "VENDOR" } },
            // { path: "STUDENT_PARENT", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "STUDENT_PARENT" } }
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            // {
            //     path: 'notification',
            //     loadChildren: () => import('app-common/notification').then(m => m.NotificationModule),
            //     data: { code: "ACCESS_NOTIFY_MGT", hideHeader: true }
            // },
            { path: 'dashboard', loadChildren: () => import('./views/dashboard').then(m => m.DashboardMasterTypeModule), data: { code: "ACCESS_DASHBRD_MGT"} },
            { path: 'document-type', loadChildren: () => import('./views/document-type').then(m => m.DocumentMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
            { path: 'address-type', loadChildren: () => import('./views/address-type').then(m => m.AddressMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
            { path: 'contact-type', loadChildren: () => import('./views/contact-type').then(m => m.ContactMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
            //{ path: 'relation-type', loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views/relation-type').then(m => m.RelationMasterTypeModule), data: { code: "ACCESS_DOC_MGT"} },
            { path: 'user-type', loadChildren: () => import('./views/user-type').then(m => m.UserTypeModule), data: { code: "ACCESS_DOC_MGT"} }
        ]
    }
];

export const USER_ACCESS_SETUP_VIEWS = [Layout];
