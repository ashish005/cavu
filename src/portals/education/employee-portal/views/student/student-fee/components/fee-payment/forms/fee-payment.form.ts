import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    FeeVoucherResponse, FeeVoucherSummary,
    MonthlyFeeInvoiceResponse,
    StudentFeeVoucherDetail,
    StudentSundryDetail
} from "../domain/fee-payment.serializer";

export class FeePaymentForm {
    formDisabled: boolean = true;
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            saleVoucher: this.fb.array([]),
            payment: this.paymentRequestGroup({})
        });
    }

    paymentRequestGroup(data) {
        const saleDate = this.toyyyymmdd(data.saleDate || '');
        return this.fb.group(<any>{
            id: [ data.id],
            partyId: [{value: data.partyId, disabled: true }],
            userId: [{value: data.userId, disabled: true }],
            voucherNo: [data.voucherNo],

            saleDate: [saleDate],
            systemTypeId: [data.systemTypeId],
            paymentModeId: [data.paymentModeId],
            totalAmount: [{value: data.totalAmount, disabled: true }],
            payAmount: [ {value: data.payAmount, disabled: true } ],

            paymentGatewayId: [data.paymentGatewayId],
            gatewayMapperId: [data.gatewayMapperId],
            gatewayAccountId: [data.gatewayAccountId],
            gatewayAccountGroupId: [data.gatewayAccountGroupId],
            refTransactionNo: [data.refTransactionNo],
            // refVoucherId: [data.refVoucherId],
            // reVoucherNo: [data.refVoucherNo],
            // refVoucherTypeId: [data.refVoucherTypeId]
            remark: [data.remark]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formSaleVoucher(): FormArray<FormGroup> { return this.customForm.get('saleVoucher') as FormArray<FormGroup>; }

    trackByIndex(index: number) {
        return index;
    }

    get formPayment(): FormGroup { return this.customForm.get('payment') as FormGroup; }

    saleVoucherDetailGroup(data: StudentFeeVoucherDetail) {
        const {
            accountId, feeStructureId, feeHead, dueDate,
            summary,
            partyAccountTransactionId, headAccountId, headAccountGroupId, headAccountTransactionId, feeChallanId, feeChallanDetailId
        } = data;
        const { balance, overDue, totalFee, paid } = summary;
        const blncAmount = balance;

        return this.fb.group({

            //New Added
            accountId: [ accountId ],
            feeHead: [ feeHead ],
            // dueStatus: [ data.dueStatus ],
            // frequency: [ data.frequency ],

            dueDate: [ dueDate ],

            partyAccountTransactionId: [ partyAccountTransactionId ],

            headAccountId: [headAccountId],
            headAccountGroupId: [headAccountGroupId],
            headAccountTransactionId: [headAccountTransactionId ],

            feeChallanId: [ feeChallanId, Validators.required ],
            feeChallanDetailId: [feeChallanDetailId, Validators.required],
            feeStructureId: [ feeStructureId ],

            overDue: [ overDue ],
            totalFee: [ totalFee ],
            paid: [ paid ],

            balance: [ balance, [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.min(0), Validators.max(blncAmount)]],
            netAmount: [ balance, [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"), Validators.min(0), Validators.max(blncAmount)]]
        });
    }

    sundryDetailFormGroup(data) {
        return this.fb.group({
            id: [data.id],
            amount: [data.amount],
            description: [data.description],
            accountId: [data.accountId],
            accountGroupId: [data.accountGroupId],
            accountTransactionId: [data.accountTransactionId],
            salesVoucherId: [data.salesVoucherId],
            rate: [data.rate],
            head: [ data.head],
            hasTax: [data.hasTax],
            taxTypeRateId: [data.taxTypeRateId],
            sundryTypeId: [data.sundryTypeId ],
            hasVoucherCredit: [data.hasVoucherCredit ]
        });
    }

    saleVoucherRequestGroup(data: MonthlyFeeInvoiceResponse) {
        const { feeVoucher, feeVoucherDetail, sundryDetail } = data;
        const {
            voucherNo,
            registrationNo, student, studentId, studentAccountId, studentAccountGroupId,
            studentUserId, orgSessionId, studentBatchId, orgBatchId, orgClassId, classSectionId,
            course, courseSection,
            summary
        } = feeVoucher;
        const { balance, totalFee, paid } = summary;

        const invoiceDate = this.toyyyymmdd(Date.now());
        const dataItem = this.fb.group({
            registrationNo: [registrationNo],

            student: [student],
            studentId: [studentId],
            studentAccountId: [studentAccountId],
            studentAccountGroupId: [ studentAccountGroupId],

            studentUserId: [studentUserId],
            orgSessionId: [orgSessionId],
            studentBatchId: [studentBatchId],
            orgBatchId: [orgBatchId],
            orgClassId: [orgClassId],
            classSectionId: [classSectionId],

            course: [ course ],
            courseSection: [ courseSection ],

            voucherDate: [ invoiceDate ],
            voucherNo: [ voucherNo ],

            // balance: [ balance ],
            // invoiceDate: [ invoiceDate ],
            // invoiceNo: [{ value : voucherNo, disabled: true }],

            // totalFee: [ totalFee ],
            // paid: [ paid ],
            saleVoucherDetail: this.fb.array([]),
            sundryDetail: this.fb.array([]),
            //Put total here of payable
            // payable:[0],
            // totalAmount:[0]
        });

        (feeVoucherDetail || []).map(r => { (<FormArray>dataItem.get('saleVoucherDetail')).push(this.saleVoucherDetailGroup(r)); });
        (sundryDetail || []).map(r => { (<FormArray>dataItem.get('sundryDetail')).push(this.sundryDetailFormGroup(r)); });
        (<FormArray>dataItem.get('sundryDetail')).push(this.sundryDetailFormGroup({ amount: 0}));

        const payable = this.getVoucherPayable();
        // dataItem.get('payable').setValue(payable);
        // dataItem.get('totalAmount').setValue(payable);
        this.formPayment.get('payAmount').setValue(payable.toFixed(2));
        return dataItem;
    }

    receiptRequestGroup(data) {
        return this.fb.group(<any>{
            id: [ data.id],
            voucherNo: [data.voucherNo],
            voucherDate: [data.voucherDate],
            amount: [data.amount],
            paymentMode: [data.paymentMode]
        });
    }

    addSaleVoucher(data: MonthlyFeeInvoiceResponse) {
        this.formSaleVoucher.push(this.saleVoucherRequestGroup(data));
    }

    getVoucherPayable(){
        const formSaleVoucherData = this.formSaleVoucher.value;
        const getVoucherTotal = (details, key) => (details || []).reduce((prev, curr) => {
            prev += parseFloat(curr[key]);
            return prev;
        }, 0);

        let voucherTotal = 0, sundryTotal = 0;
        for (let item of formSaleVoucherData) {
            voucherTotal += getVoucherTotal(item.saleVoucherDetail, 'netAmount');
            sundryTotal += (item.sundryDetail || []).reduce((prev, curr) => {
                if(!curr.accountTransactionId){
                    if(!curr.hasVoucherCredit){ prev -= parseFloat(curr.amount); }
                    else { prev += parseFloat(curr.amount); }
                }
                return prev;
            }, 0);
        }
        const wholeVal: any = Math.round(voucherTotal + sundryTotal);
        return wholeVal;
    }

    /*getVoucherPayableForFirstTime(details, sundryDetailData){
        const detailsPayable = (details || []).reduce((prev, curr: any) => {
            const val: any = curr.summary.totalFee - curr.summary.paid;
            prev += parseFloat(val);
            return prev;
        }, 0);

        const sundryDetailAmount = (sundryDetailData || []).reduce((prev, curr) => {
            if(!curr.accountTransactionId && !curr.hasVoucherCredit){
                prev -= parseFloat(curr.amount);
            } else if(!curr.accountTransactionId){
                prev += parseFloat(curr.amount);
            }
            return prev;
        }, 0);
        const sumVal = parseFloat(detailsPayable) + parseFloat(sundryDetailAmount);

        const wholeVal: any = Math.round(sumVal);
        return wholeVal;
    }*/

    populatePayFeeVoucherForm(entities: Array<MonthlyFeeInvoiceResponse>){
        this.formSaleVoucher.controls.length = 0;
        (entities || []).map((data: MonthlyFeeInvoiceResponse) => this.addSaleVoucher(data));

        //Calculate total payable form service data - UPdate all vouchers payable
        this.updateNetPayableAmount();
    }

    updateNetPayableAmount(){
        /*const formSaleVoucherData = this.formSaleVoucher.value;

        //calculate payable fee for the voucher
        const payableSaleVoucherVal = (formSaleVoucherData || []).reduce((prev, curr)=>{
            prev+= parseFloat(curr.payable);
            return prev;
        }, 0);

        const sumVal: any = parseFloat(payableSaleVoucherVal);
        //calculate Total fee for the voucher
        // const totalVoucherFee = (formSaleVoucherData || []).reduce((prev, curr)=>{
        //     prev+= parseFloat(curr.totalFee);
        //     return prev;
        // }, 0);

        this.formPayment.get('payAmount').setValue(sumVal.toFixed(2));
        //this.formPayment.get('totalAmount').setValue(totalVoucherFee.toFixed(2));*/
        const formSaleVoucherData = this.formSaleVoucher.value;

        const payable = this.getVoucherPayable();
        this.formPayment.get('payAmount').setValue(payable.toFixed(2));
    }

    toyyyymmdd(val) {
        let _date = val;
        if(!val){
            _date = new Date();
        } else {
            _date = new Date(val);
        }

        const day = _date.getDate();
        const month = _date.getMonth() + 1;
        const year = _date.getFullYear();
        return year+"-"+month.toString().padStart(2, 0) + "-" + day.toString().padStart(2, 0);
    }
}