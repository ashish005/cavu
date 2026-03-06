import {Component, Injector, Input, OnInit} from '@angular/core';
import {catchError, throwError, map} from "rxjs";
import {StudentFeePayVoucherWrapper} from "../domain/batch-invoice.serializer";
import {CoreEndpointBase} from "@app-global";


@Component({
    standalone: false,
  templateUrl: './templates/fee-period-wise-summary.html',
  styles: [ `:host { display: contents;}`]
})
export class FeePeriodWiseSummaryComponent extends CoreEndpointBase implements OnInit {
    @Input() studentId: string;
    @Input() classId: number;
    @Input() orgSessionId: number;

    payVoucherList: Array<any>;
    constructor(public override injector: Injector) { super(injector);}

    ngOnInit(){
        this.populateFeeVoucherForm();
    }

    populateFeeVoucherForm(){
        const success = (data: Array<StudentFeePayVoucherWrapper>)=> {
            this.payVoucherList = (data || []).sort((a: any, b: any) => {
                return new Date(a.dueYear, a.dueMonth, 1).valueOf() - new Date(b.dueYear, b.dueMonth, 1).valueOf()
            });
        };
        const failure = ()=>{};
        this.getStudentPaymentInvoiceByClassAndSession(this.studentId, this.classId, this.orgSessionId).subscribe(success, failure);
    }

    getStudentPaymentInvoiceByClassAndSession(studentId: string, classId: number, orgSessionId: number){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}FeePayment/due-fee-invoice/${studentId}/${classId}/${orgSessionId}`, this.requestHeaders)
            .pipe(
                map((resp: any) =>  (resp.entities || []).map(r => new StudentFeePayVoucherWrapper(r))),
                catchError(error=> this.handleError(error, () => this.getStudentPaymentInvoiceByClassAndSession(studentId, classId, orgSessionId)))
            );
    }
}

@Component({
    standalone: false,
    templateUrl: './templates/fee-period-wise-summary.html',
    //templateUrl: './templates/fee-month-wise-summary.html',
    styles: [ `:host { display: contents;}`]
})
export class FeeMonthWiseSummaryComponent extends CoreEndpointBase implements OnInit {
    @Input() studentBatchId: string;
    @Input() orgSessionId: number;

    payVoucherList: Array<any>;
    constructor(public override injector: Injector) { super(injector);}

    ngOnInit(){
        this.populateFeeVoucherForm();
    }

    populateFeeVoucherForm(){
        const success = (data: Array<StudentFeePayVoucherWrapper>)=> {
            this.payVoucherList = (data || []).sort((a: any, b: any) => {
                return new Date(a.dueYear, a.dueMonth, 1).valueOf() - new Date(b.dueYear, b.dueMonth, 1).valueOf()
            });
        };
        const failure = ()=>{};
        this.getStudentPaymentInvoiceByClassAndSession(this.studentBatchId, this.orgSessionId).subscribe(success, failure);
    }

    getStudentPaymentInvoiceByClassAndSession(studentBatchId: string, orgSessionId: number){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}FeePayment/due-fee-invoice/${studentBatchId}/${orgSessionId}`, this.requestHeaders)
            .pipe(
                map((resp: any) =>  (resp.entities || []).map(r => new StudentFeePayVoucherWrapper(r))),
                catchError(error=> this.handleError(error, () => this.getStudentPaymentInvoiceByClassAndSession(studentBatchId, orgSessionId)))
            );
    }
}
