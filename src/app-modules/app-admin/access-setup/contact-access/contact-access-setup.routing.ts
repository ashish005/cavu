import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {UserAccessSetupAPIResolver} from "./services/api.resolver";
export const User_Acccess_Setup_Routes: Routes = [
    {
        path: '', data: { title: 'User Acccess Setup', header:'User Acccess Setup'},
        component: Layout, resolve: { items: UserAccessSetupAPIResolver },
        children: [
            //{ path: '', pathMatch: 'full', redirectTo: "EMPLOYEE" },
            { path: "**", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "EMPLOYEE" } },
            // { path: "CLIENT", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "CLIENT" } },
            // { path: "VENDOR", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "VENDOR" } },
            // { path: "STUDENT_PARENT", loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: "STUDENT_PARENT" } }
        ]
    }
];

export const USER_ACCESS_SETUP_VIEWS = [Layout];
