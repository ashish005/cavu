import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {
    MonthlyFeePaymentVoucher, MonthlyFeeVoucherWrapper
} from "../domain/fee-payment.serializer";
import {FormBuilder} from "@angular/forms";
import {FeePaymentForm} from "../forms/fee-payment.form";
import {FeePaymentAPIResolver} from "../services/api.resolver";
import {FeePaymentService} from "../services/fee-payment.service";

@Component({ standalone: false, templateUrl: './templates/layout.html' })
export class FeePaymentLayout extends FeePaymentForm implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    public isLoading: boolean = true;
    public actionTemplate: TemplateRef<any>;

    tabs: any = {
        'payment': 'payment',
        'reciept': 'reciept',
        'summary': 'summary'
    };
    @Input() viewType;
    @Input() set data(val: any){
        this.studentAccountId = val?.studentAccountId;
        this.inputData = val;
        this.populateVoucher(val);
    };
    openTab(tab: string){ this.viewType = tab; }

    studentAccountId: string;

    inputData: any;
    monthlyVoucherList: Array<MonthlyFeePaymentVoucher>;
    activeVoucher: MonthlyFeePaymentVoucher;
    constructor(public override fb: FormBuilder,
                public activatedRoute: ActivatedRoute,
                public lookupService: FeePaymentAPIResolver,
                private feePaymentService: FeePaymentService) {
        super(fb);
    }

    ngOnInit()
    {
        this.viewType = this.viewType || this.tabs.payment;
        this.isLoading = true;
        this.lookupService.resolve((r) => { this.isLoading = false; });
    }
    ngOnDestroy(){ this.lookupService.subscription?.unsubscribe(); }

    private populateVoucher(item: any) {
        this.populateFeeVoucherForm(item, (dataItem: MonthlyFeePaymentVoucher) => {
            this.activeVoucher = dataItem;
            this.selectedMonthVoucherByDueDate(dataItem);
        });
    }

    private populateFeeVoucherForm(item: any, cb){
        this.isLoading = true;
        const { id: studentBatchId, orgSessionId, dueDate } = item;

        const success = (data: MonthlyFeeVoucherWrapper)=> {
            this.isLoading = false;
            this.monthlyVoucherList = data.list;
            const dataItem: MonthlyFeePaymentVoucher = data.getMonthlyVoucherByDueDate(dueDate);
            cb(dataItem);
        };
        const failure = ()=>{ this.isLoading = false; };

        var service = this.feePaymentService.getStudentMonthlyPaymentSummaryByClassAndSession(studentBatchId, orgSessionId);
        service.subscribe(success, failure);
    }

     selectedMonthVoucherByDueDate = (item: MonthlyFeePaymentVoucher) => {
        if(item)
        {
            this.isLoading = true;
            const success = (data)=> { this.isLoading = false; super.populatePayFeeVoucherForm(data); };
            const failure = ()=>{ this.isLoading = false; };

            this.activeVoucher = item;
            const { studentBatchId, orgSessionId, dueMonth, dueYear } = item;
            var service = this.feePaymentService.getStudentMonthlyPaymentInvoiceByClassAndSession(studentBatchId, orgSessionId, dueMonth, dueYear);
            service.subscribe(success, failure);
        }
    }

    syncVoucher(data){
        super.updateNetPayableAmount();
    }

    onPaymentSuccess(resp){
        this.populateFeeVoucherForm(this.inputData, (dataItem: MonthlyFeePaymentVoucher) => {
            this.selectedMonthVoucherByDueDate(this.activeVoucher);
        });
    }
}