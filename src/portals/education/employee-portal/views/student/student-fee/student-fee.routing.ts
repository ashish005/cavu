import {RouterModule, Routes} from "@angular/router";
import {FeeByOrgClassView} from "./views/fee-by-org-class.view";
import {FeeByStudentBatchView} from "./views/fee-by-student-batch.view";
import {FeeByFeeTypeView} from "./views/fee-by-fee-type.view";
import {FeeByOrgClassSectionView} from "./views/fee-by-org-class-section.view";
import {FeeByOrgBatchView} from "./views/fee-by-org-batch.view";
import {StudentFeeLayout} from "./layout/layout";

export const StudentFeeRoutes: Routes = [
  {
    path: '', component: StudentFeeLayout,
    children:[
      { path: '', pathMatch: 'full', redirectTo:'report' },
      { path: 'report', component: FeeByStudentBatchView, data: {title: 'Student Batch', header:'Student Batch'} },
      { path: 'head', component: FeeByFeeTypeView, data: {title: 'Fee Type', header:'Fee Type'} },
      { path: 'class', component: FeeByOrgClassView, data: {title: 'Class', header:'Class'} },
      { path: 'class-section', component: FeeByOrgClassSectionView, data: {title: 'Class Section', header:'Class Section'} },
      { path: 'batch', component: FeeByOrgBatchView, data: {title: 'Batch', header:'Batch'} }
    ]
  }
];

export const STUDENT_FEE_VIEWS = [
    StudentFeeLayout,
    FeeByStudentBatchView, FeeByFeeTypeView, FeeByOrgClassView, FeeByOrgClassSectionView, FeeByOrgBatchView
];
