import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudentBatchService} from "../services/student-batch.service";
import {StudentBatch, StudentBatchQueryOptions} from "../domains/student-batch.serializer";
import {ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/student-batch.html',
    styles: [`:host { display: contents;}`]
})
export class StudentBatchView extends ViewExtender<StudentBatch> implements OnInit {
    override coreState: StudentBatchQueryOptions = new StudentBatchQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: StudentBatchService) {
        super(activatedRoute, service);
        const { data, parent} = this.activatedRoute.snapshot;
        //this.pageTitle = data.title || parent?.data?.title;
        //(<StudentBatchQueryOptions>this.coreState).orgUserId = coreService.currentUser.id;
    }

    ngOnInit() {
        super.populateGrid();
    }

    showFeeInvoices(data: StudentBatch){
        // const popup = {
        //   header: { text: `${data.course+''+ (data.courseSection || '')}`, desc: 'Course Fee Payment summary' },
        //   aside: ASIDE_CLASS.RIGHT,
        //   size: ASIDE_SIZE.W_75
        // };
        //
        // const inputData: any = {
        //   studentId: data.studentId,
        //   classId: data.orgClassId,
        //   orgSessionId: data.orgSessionId,
        //   data: data,
        //   actionType: ACTION_ENUM.SHOW
        // };
        // let modal$ = this.popupService.showCustomPopup(CourseFeePeriodWiseSummaryComponent, popup, inputData);
        // modal$.then((resp)=>{
        //   this.popupService.destroy();
        // }, (err)=>{
        //   this.popupService.destroy();
        // });
    }

    showReceiptVoucher(r){}

    /*showReceiptVoucher(data: StudentBatch){
      const popup = {
        header: { text: `${data.course+''+ (data.courseSection || '')}`, desc: 'Course Fee Payment summary' },
        aside: ASIDE_CLASS.RIGHT,
        size: ASIDE_SIZE.W_50
      };

      const inputData: any = {
        studentId: data.studentId,
        accountId: data.accountId,
        orgSessionId: data.orgSessionId,
        actionType: ACTION_ENUM.SHOW
      };
      let modal$ = this.popupService.showCustomPopup(ReceiptVoucherComponent, popup, inputData);
      modal$.then((resp)=>{
        this.popupService.destroy();
      }, (err)=>{
        this.popupService.destroy();
      });
    }*/

    showAccountBook(data: StudentBatch){
        // const popup = {
        //     header: { text: `${data.course+''+ (data.courseSection || '')}`, desc: 'Course Fee Payment summary' },
        //     aside: ASIDE_CLASS.RIGHT,
        //     size: ASIDE_SIZE.W_75
        // };
        // const inputData: any = {
        //     studentId: data.studentId,
        //     accountId: data.accountId,
        //     orgSessionId: data.orgSessionId,
        //     viewType: 'tab',
        //     actionType: ACTION_ENUM.SHOW
        // };
        // let modal$ = this.popupService.show(FinanceAccountBook, popup, inputData);
        // modal$.then((resp)=>{
        //   this.popupService.destroy();
        // }, (err)=>{
        //   this.popupService.destroy();
        // });
    }
}