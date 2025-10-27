import {Routes} from '@angular/router';
import {Layout} from "./layout/layout";
import {UserAccessSetupAPIResolver} from "./services/api.resolver";
import {ORG_USER_TYPE} from "@app-global";
export const User_Acccess_Setup_Routes: Routes = [
    {
        path: '', data: { title: 'User Acccess Setup', header:'User Acccess Setup'},
        component: Layout, resolve: { items: UserAccessSetupAPIResolver },
        children: [
            { path: '', pathMatch: 'full', redirectTo: ORG_USER_TYPE.EMPLOYEE },
            { path: ORG_USER_TYPE.EMPLOYEE, loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: ORG_USER_TYPE.EMPLOYEE } },
            { path: ORG_USER_TYPE.CLIENT, loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: ORG_USER_TYPE.CLIENT } },
            { path: ORG_USER_TYPE.VENDOR, loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: ORG_USER_TYPE.VENDOR } },
            { path: ORG_USER_TYPE.STUDENT_PARENT, loadChildren: () => import('app-modules/app-admin/access-setup/contact-access/views').then(m => m.SettingAccessSetupModule), data: { userType: ORG_USER_TYPE.STUDENT_PARENT } }
        ]
    }
];

export const USER_ACCESS_SETUP_VIEWS = [Layout];
