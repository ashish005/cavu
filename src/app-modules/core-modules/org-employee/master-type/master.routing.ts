import {RouterModule, Routes} from "@angular/router";
import {MasterLayoutLayout, MasterLeaveLayoutLayout} from "./layout/layout";
import {ManageDepartmentView} from "./views/manage-department.view";
import {ManageDutyView} from "./views/manage-duty.view";
import {ManageGradeView} from "./views/manage-grade.view";
import {ManageLeaveView} from "./views/manage-leave.view";
import {ManagePostView} from "./views/manage-post.view";
import {ManageLeaveGroupView} from "./views/manage-leave-group.view";

export const EmployeeMasterRoutes: Routes = [
    {
        path: '', component: MasterLayoutLayout, data: {  title: 'Master', headers: 'Master' },
        children:[
            { path: '', pathMatch: 'full', redirectTo:'department' },
            { path: 'department', component: ManageDepartmentView, data: {title: 'Manage'} },
            { path: 'duty', component: ManageDutyView, data: {title: 'Manage'} },
            { path: 'grade', component: ManageGradeView, data: {title: 'Manage'} },
            { path: 'post', component: ManagePostView, data: {title: 'Manage'} },
            {
                path: 'leave', component: MasterLeaveLayoutLayout, data: {title: 'Master', headers: 'Master'},
                children: [
                    { path: '', pathMatch: 'full', redirectTo:'type' },
                    { path: 'type', component: ManageLeaveView, data: {title: 'Manage'} },
                    { path: 'group', component: ManageLeaveGroupView, data: {title: 'Manage'} },
                ]
            }
        ]
    },
];

export const EMP_MASTER_VIEWS = [
    MasterLayoutLayout, ManageDepartmentView, ManageDutyView, ManageGradeView, ManagePostView,
    MasterLeaveLayoutLayout, ManageLeaveView, ManageLeaveGroupView
];