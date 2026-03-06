import {
    FeeVoucherSummary,
    StudentSundryDetail
} from "./fee-payment.serializer";

export class FeeVoucherDetail {
    feeHead: string;
    dueStatus: string;
    overDue: number;
    accountId: string;
    frequency: string;
    feeStructureId: number;

    dueDate: string;

    headAccountId: string;
    headAccountGroupId: number;
    headAccountTransactionId: number;
    partyAccountTransactionId: number;

    feeChallanId: number;
    summary: FeeVoucherSummary;
    constructor(model: any = <any>{}) {
        this.feeHead = model.feeHead;
        this.dueStatus = model.dueStatus;
        this.frequency = model.frequency;
        this.feeStructureId = model.feeStructureId;

        this.overDue = model.overDue;
        this.accountId = model.accountId;

        this.dueDate = model.dueDate;

        this.headAccountId = model.headAccountId;
        this.headAccountGroupId = model.headAccountGroupId;
        this.headAccountTransactionId = model.headAccountTransactionId;
        this.partyAccountTransactionId = model.partyAccountTransactionId;

        this.feeChallanId = model.feeChallanId;

        this.summary = new FeeVoucherSummary(model.summary);
    }
}
export class StudentFeePayVoucherWrapper {
    name: string;
    dueMonth: number;
    dueYear: number;
    voucherDetails: Array<FeeVoucherDetail>;
    sundryDetail: Array<StudentSundryDetail>;
    constructor(model: any = <any>{}){
        this.name = model.name;
        this.dueMonth = model.dueMonth;
        this.dueYear = model.dueYear;
        this.voucherDetails = (model.voucherDetails || []).map(r=> new FeeVoucherDetail(r));
        this.sundryDetail = (model.sundryDetail || []).map(r=> new StudentSundryDetail(r));
    }

    getTotalAmount=()=>(this.voucherDetails || []).reduce((result, curr) => result += curr.summary.totalFee, 0);
    getTotalPaid=()=>(this.voucherDetails || []).reduce((result, curr) => result += curr.summary.paid, 0);
    getTotalDueFee=()=>(this.voucherDetails || []).reduce((result, curr) => result += curr.summary.dueFee, 0);
    getTotalBalance=()=>(this.voucherDetails || []).reduce((result, curr) => result += curr.summary.balance, 0);
}

