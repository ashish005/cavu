import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {FeeByStudentBatch} from "../domains/fee-by-student-batch.serializer";
import {FeePaymentPluginFactory} from "../components/fee-payment";
import {BatchCourseFee} from "../../manage/domains/batch-course-fee.serializer";
import {FeeByStudentBatchService} from "../services/fee-by-student-batch.service";
import {DynamicComponent} from "@app-global";

@Component({
    standalone: false,
    template: `<div>{{context.courseName}} {{context.courseSectionName}}</div>`
})
export class SBCourseNameActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) { super(); }
}

@Component({
    standalone: false,
    template: `<div>{{context.className}} {{context.classSectionName}}</div>`
})
export class SBClassNameActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) { super(); }
}

@Component({
    standalone: false,
    template: `<div class="btn-group">
            <a class="btn btn-xs text-xs pr-2" (click)="showStudentClassWiseFeeSummary(context)">Summary</a>
            <a class="btn btn-xs text-xs _400" (click)="showFeePayInfo(context)"> Pay </a>
            <a class="btn btn-xs text-xs _400" (click)="showLedgerInfo(context)"> Ledger </a>
        </div>`
})
export class SBStudentNameActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute, private pluginFactory: FeePaymentPluginFactory) { super(); }

    showFeePayInfo(row: FeeByStudentBatch){
        const { id, studentId, orgClassId, orgSessionId, studentName, registrationNo, dueFee, dueDate, courseName } = row;
        const inputData: any = {
            id: id,
            data: row,
            viewType: 'payment'
        };
        const popupHeaderOption = { text: `Due Payment ${dueFee} for ${studentName}`, desc: `${registrationNo} Due Date: ${dueDate} Course: ${courseName}`};

        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };
        this.pluginFactory.showStudentFeePaymentPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showStudentClassWiseFeeSummary(row: FeeByStudentBatch){
        const { id, orgSessionId, studentName, registrationNo, dueDate, courseName } = row;
        const inputData: any = {
            studentBatchId: id,
            orgSessionId: orgSessionId
        };
        const popupHeaderOption = { text: `Due Payment ${row.dueFee} for ${studentName}`, desc: `${registrationNo} Due Date: ${dueDate} Course: ${courseName}`};

        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };
        this.pluginFactory.showMonthWiseFeeSummaryPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showLedgerInfo(row: FeeByStudentBatch) {
        const { studentId, studentAccountId, studentName } = row;
        const inputData = { accountId: studentAccountId };
        const popupHeaderOption = { text: `Account Book for ${studentName}`, desc: `Ledger Details`};

        // const success = (resp: any) => { this.coreAccountFactory.destroy(); };
        // const failure = (e) => { this.coreAccountFactory.destroy(); };
        // this.coreAccountFactory.showLedgerWiseGridReportPopup(inputData, popupHeaderOption).then(success, failure);
    }
}

@Component({
    standalone: false,
    template: `<div>
            <!--<a *ngIf="!context.isFeeSynced" class="btn btn-xs text-xs text-danger" (click)="syncFeePlanWithChallan(context)"> 
                Fix It <span *ngIf="isSyncProcessed"><i class="fa fa-spinner text-success"></i></span>
            </a>-->
            <a class="btn btn-xs text-xs _400" [ngbPopover]="challanBreakup" placement="auto" container="body" (mouseenter)="p.open()" #p="ngbPopover" (mouseleave)="p.close()"><i class="fa fa-pie-chart"></i>
            </a>
            <ng-template #challanBreakup>
                <div class="w w-auto">
                    <div class="flex pb-2">
                        <h6 class="text-sm mb-0 _600">Fee Head Wise</h6>
                        <small class="text-muted">Breakup details</small>
                    </div>
                    <table class="table small-table text-xs mb-0">
                            <thead>
                            <tr>
                                <th><span>Date</span></th>
                                <th><span>Total</span></th>
                                <th><span class="float-right">Due</span></th>
                                <th><span class="float-right">Advance</span></th>
                                <th><span class="float-right">Balance</span></th>
                                <th><span class="float-right">Paid</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            <ng-template ngFor let-row [ngForOf]="context.challanStructure" let-j="index">
                                <tr>
                                    <td><span>{{ row.name }}</span></td>
                                    <td><span>{{ row.totalFee | orgCurrency }}</span></td>
                                    <td><span class="pr-2 float-right">{{ row.dueFee | orgCurrency }}</span></td>
                                    <td><span class="pr-2 float-right">{{ row.paid | orgCurrency }}</span></td>
                                    <td><span class="float-right">{{ row.balance | orgCurrency }}</span></td>
                                    <td><span class="float-right">{{ row.advance | orgCurrency }}</span></td>
                                </tr>
                            </ng-template>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><b class="float-right">Total</b></td>
                                <td><b class="float-right">{{ context.totalFee | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context.dueFee | orgCurrency }}</b></td>
                                <td><b class="pr-2 float-right">{{ context.paid | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context.balance | orgCurrency }}</b></td>
                                <td><b class="float-right">{{ context.advance | orgCurrency }}</b></td>
                            </tr>
                            </tfoot>
                        </table>
                </div>
            </ng-template>
    </div>`
})
export class StudentFeeBreakupActionCell extends DynamicComponent {
    isSyncProcessed: boolean = false;
    constructor(public service: FeeByStudentBatchService) { super(); }

    syncFeePlanWithChallan(row: BatchCourseFee) {
        const { feePlanId, id } = row;
        const inputData: any = { feePlanId: feePlanId, StudentBatchId: id };

        const success = (resp: any) => {
            this.isSyncProcessed = false;
        };
        const failure = (err: any) => {
            this.isSyncProcessed = false;
        };

        this.isSyncProcessed = true;
        this.service.syncBatchFee(inputData).toPromise().then(success, failure);
    }
}