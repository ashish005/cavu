import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {STUDENT_Routes, STUDENT_VIEWS} from "./student-portal.routing";
import {StudentPortalAPIResolver} from "./services/api.resolver";
import {StudentInformationService} from "./services/student-information.service";
import {STUDENT_COMPONENT} from "./components";
import {TransactionService} from "./services/transaction.service";
import {StudentBatchService} from "./services/student-batch.service";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, FormsModule,
    RouterModule.forChild(STUDENT_Routes),
    GlobalModule,
    ReactiveFormsModule
  ],
  providers: [StudentPortalAPIResolver, StudentInformationService, StudentBatchService, TransactionService],
  declarations: [STUDENT_VIEWS, STUDENT_COMPONENT]
})

export class EduStudentPortal{
  constructor(){
    console.log('org module');
  }
}
