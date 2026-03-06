import {Routes} from "@angular/router";
import {StudentSubLayout} from "./layout/layout";
import {StudentBatchView} from "./views/batch.view";
import {StudentDocumentView} from "./views/document.view";
import {StudentEditView} from "./views/student-edit.view";
import {AddressGuardianView} from "./views/address-guardian.view";
import {StudentAPIResolver} from "./services/api.resolver";
import {StudentService} from "./services";

const translatePath = 'modules.project.sub_module';
export const SubStudentRoutes: Routes = [
    {
        path: '', component: StudentSubLayout,
        resolve: { lookup: StudentAPIResolver, student: StudentService }, data: {title: 'Manage Students', header:'Students'},
        children:[
            { path: '', pathMatch: 'full', redirectTo:'info' },
            {path: 'info', component: StudentEditView},
            {path: 'address-guardian', component: AddressGuardianView},
            {path: 'document', component: StudentDocumentView},
            {path: 'batch', component: StudentBatchView},
        ]
    }
];

export const SUB_STUDENT_VIEWS = [
    StudentSubLayout,
    StudentEditView, AddressGuardianView, StudentBatchView, StudentDocumentView
];
