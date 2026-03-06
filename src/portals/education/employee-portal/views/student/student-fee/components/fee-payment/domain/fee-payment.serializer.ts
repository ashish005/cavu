export class StudentSundryDetail {
    id: number;
    amount: number;
    description: string;
    rate: string;
    accountId: string;
    accountGroupId: number;
    accountTransactionId: number;
    voucherId: number;
    head: string;
    hasTax: boolean;
    taxTypeRateId: number;
    sundryTypeId: number;
    voucherTypeId: number;
    voucherPartyId: number;
    hasVoucherCredit: boolean;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.amount = model.amount;
        this.description = model.description;
        this.rate = model.rate;
        this.accountId = model.accountId;
        this.accountGroupId = model.accountGroupId;
        this.accountTransactionId = model.accountTransactionId;
        this.voucherId = model.voucherId;
        this.head = model.head;
        this.hasTax = model.hasTax;
        this.taxTypeRateId = model.taxTypeRateId;
        this.sundryTypeId = model.sundryTypeId;
        this.voucherTypeId = model.voucherTypeId;
        this.voucherPartyId = model.voucherPartyId;
        this.hasVoucherCredit = model.hasVoucherCredit;
    }
}

export class StudentFeeVoucher {
    id: string;
    studentId: string;
    registrationNo: string;
    student: string;
    studentAccountId: string;
    studentAccountGroupId: number;
    course: string;
    courseSection: string;
    summary: FeeVoucherSummary;
    netAmount: number;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.studentId = model.studentId;
        this.student = model.student;
        this.registrationNo = model.registrationNo;
        this.studentAccountGroupId = model.studentAccountGroupId;
        this.studentAccountId = model.studentAccountId;
        this.course = model.course;
        this.courseSection = model.courseSection;

        this.summary = new FeeVoucherSummary(model.summary);
        this.netAmount = model.summary.balance;
    }
}

export class StudentFeeVoucherInfo extends StudentFeeVoucher {
    partyAccountTransactionId: number;
    studentBatchId: number;

    constructor(model: any = <any>{}) {
        super(model);
        this.partyAccountTransactionId = model.partyAccountTransactionId;
        this.studentBatchId = model.studentBatchId;
    }
}

export class StudentFeeVoucherDetail {
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

    feeChallanDetailId: number;
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
        this.feeChallanDetailId = model.feeChallanDetailId;
        this.summary = new FeeVoucherSummary(model.summary);
    }
}

export class FeeVoucherSummary {
    totalFee: number;
    paid: number;
    balance: number;
    overDue: number;
    adjusted: number;
    advance: number;
    concession: number;
    dueAmount: number;
    dueFee: number;
    monthPayAmount: number;
    paidTillDate: number;

    feeStatus: string;

    constructor(model: any = <any>{}) {
        const {paid, balance, totalFee, overDue, adjusted, advance, concession, dueAmount, dueFee, monthPayAmount, paidTillDate, feeStatus} = model;

        this.paid = paid;
        this.balance = balance;
        this.totalFee = totalFee;
        this.overDue = overDue;
        this.adjusted = adjusted;
        this.advance = advance;
        this.concession = concession;
        this.dueAmount = dueAmount;
        this.dueFee = dueFee;
        this.monthPayAmount = monthPayAmount;
        this.paidTillDate = paidTillDate;

        this.feeStatus = feeStatus;
    }
}

export class FeeVoucherResponse {
    studentId: string;
    studentUserId: string;
    registrationNo: number;
    student: number;
    studentAccountId: string;
    studentAccountGroupId: number;

    course: string;
    courseSection: string;

    orgSessionId: number;
    studentBatchId: string;
    orgBatchId: number;
    orgClassId: number;
    classSectionId: number;

    voucherNo: string;
    voucherDate: string;

    summary: FeeVoucherSummary;

    constructor(model: any = <any>{}) {
        const {
            studentId, studentUserId, student,
            registrationNo, studentAccountGroupId, studentAccountId,
            course, courseSection,
            studentBatchId, orgSessionId, orgBatchId, orgClassId, classSectionId,
            summary, voucherNo, voucherDate
        } = model;
        this.studentId = studentId;
        this.studentUserId = studentUserId;
        this.student = student;
        this.registrationNo = registrationNo;
        this.studentAccountGroupId = studentAccountGroupId;
        this.studentAccountId = studentAccountId;
        this.course = course;
        this.courseSection = courseSection;

        this.orgSessionId = orgSessionId;
        this.studentBatchId = studentBatchId;
        this.orgBatchId = orgBatchId;
        this.orgClassId = orgClassId;
        this.classSectionId = classSectionId;

        this.voucherNo = voucherNo;
        this.voucherDate = voucherDate;
        this.summary = new FeeVoucherSummary(summary);
    }
}

export class MonthlyFeeInvoiceResponse {
    name: string;
    dueMonth: number;
    dueYear: number;
    feeVoucher: FeeVoucherResponse;
    feeVoucherDetail: Array<StudentFeeVoucherDetail>;
    sundryDetail: Array<StudentSundryDetail>;

    constructor(model: any = <any>{}) {
        const {name, dueMonth, dueYear, feeVoucher, feeVoucherDetail, sundryDetail} = model;
        this.name = name;
        this.dueMonth = dueMonth;
        this.dueYear = dueYear;
        this.feeVoucher = new FeeVoucherResponse(feeVoucher);
        this.feeVoucherDetail = (feeVoucherDetail || []).map(r => new StudentFeeVoucherDetail(r));
        this.sundryDetail = (sundryDetail || []).map(r => new StudentSundryDetail(r));
    }
}

export class MonthlyFeePaymentVoucher {
    index: number;
    name: string;
    dueMonth: number;
    dueYear: number;
    totalFee: number;
    totalPaid: number;
    advance: number;
    balance: number;
    adjusted: number;

    studentBatchId: string;
    studentId: string;
    orgSessionId: string;
    isSettled: boolean;

    constructor(model: any = <any>{}) {
        this.index = model.index;
        this.name = model.name;
        this.dueMonth = model.dueMonth;
        this.dueYear = model.dueYear;

        this.totalFee = model.totalFee;
        this.totalPaid = model.totalPaid;
        this.advance = model.advance;
        this.balance = model.balance;
        this.adjusted = model.adjusted;

        this.studentBatchId = model.studentBatchId;
        this.studentId = model.studentId;
        this.orgSessionId = model.orgSessionId;

        this.isSettled = model.isSettled;
    }
}

export class MonthlyFeeVoucherWrapper {
    list: Array<MonthlyFeePaymentVoucher>;

    constructor(model: Array<MonthlyFeePaymentVoucher>) {
        this.list = (model || []).map((r, i) => {
            r.index = i + 1;
            return new MonthlyFeePaymentVoucher(r);
        });
    }

    public getMonthlyPayVoucherList() {
        return (this.list || []).sort((a: MonthlyFeePaymentVoucher, b: MonthlyFeePaymentVoucher) => {
            return new Date(a.dueYear, a.dueMonth, 1).valueOf() - new Date(b.dueYear, b.dueMonth, 1).valueOf()
        });
    }

    getMonthlyVoucherByDueDate(dateStr) {
        const d = new Date(dateStr);
        const _month = d.getMonth() + 1;
        const _year = d.getFullYear();
        return (this.list || []).find(r => r.dueMonth == _month && r.dueYear == _year);
    }
}
