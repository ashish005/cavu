import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {PERMISSION_MANAGEMENT_COMPONENT, USER_MANAGEMENT_COMPONENT} from "./components";
import {MANAGE_USER_SERVICES} from "./services";
import {USER_MANAGEMENT_GRID_CELl} from "./grid-cells";
import {UserManagementAPIResolver} from "./services/api.resolver";
import {RolePermissionManager} from "./views/role-permission-manager";
import {PermissionLayout} from "./layout/layout";
import {GlobalModule} from "@app-global";
import { ReactiveFormsModule} from "@angular/forms";

/*@Component({template: '<router-outlet></router-outlet>'})
export class Layout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['list'], icon:"fa fa-envelope", key: 'User Permission' },
                { routeTo: ['role-module-permission'], icon:"fa fa-dashboard", key: 'Module Permission' }
            ]
        }
    ];
    constructor(){}
    onActivate(componentRef){}
}*/

export const MANAGE_USER_VIEWS = [
    //UsersManagementView,
    RolePermissionManager
];
@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: PermissionLayout, resolve: [UserManagementAPIResolver],
                children:[
                    {path: '', redirectTo: 'role-module', pathMatch: 'full'},
                    { path: 'role-module', component: RolePermissionManager, data: { title: 'modules.authorization.title'} },
                    //{ path: 'users', component: UsersManagementView, data: {title: 'User Permission'} }
                ]
            }
        ]),
      GlobalModule
    ],
    providers: [MANAGE_USER_SERVICES, UserManagementAPIResolver],
    declarations: [PermissionLayout, MANAGE_USER_VIEWS, PERMISSION_MANAGEMENT_COMPONENT, USER_MANAGEMENT_COMPONENT, USER_MANAGEMENT_GRID_CELl]
})

export class ManageUserModule{}


