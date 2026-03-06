import {RouterModule, Routes} from "@angular/router";
import {StudentManageView} from "./views/manage.view";
import {StudentLayout} from "./layout/layout";
import {StudentBatchLookupService} from "./services/api.resolver";

export const StudentRoutes: Routes = [
    {
        path: '', component: StudentLayout, resolve: { StudentBatchLookupService },
        data: { code:'', title: 'Student', icon: 'fa fa-dashboard', header: 'Manage Students' },
        children: [
            { path: '', component: StudentManageView }
        ]
    }
];

export const STUDENT_VIEWS = [ StudentLayout, StudentManageView ];
