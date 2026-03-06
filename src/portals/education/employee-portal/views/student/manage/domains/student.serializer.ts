import {CoreQueryOptions} from "@app-global";

export class StudentSummaryQueryOptions extends CoreQueryOptions{
    code: string;

    constructor(data: any = {}){
        super(data);
    }

    override toQueryString (){
        const obj = {
            code:this.code
        };
        return super.getParamByObject(obj);
    }
}

class FeeChallanSummary {
    dueMonth: number;
    dueYear: number;

    advance: number;
    balance: number;
    dueFee: number;
    paid: number;
    totalFee: number;
    name: string;

    constructor(model: any = {}){
        const { dueMonth, dueYear, advance, balance, dueFee, paid, totalFee, name } = model;
        this.dueMonth = dueMonth;
        this.dueYear = dueYear;
        this.advance = advance || 0;
        this.balance = balance || 0;
        this.dueFee = dueFee || 0;
        this.paid = paid || 0;
        this.totalFee = totalFee || 0;
        this.name = name;
    }
}

export class StudentSummary {
    id: string;
    address: string;
    bloodGroup: string;
    birthday: string;
    email: string;
    phone: string;
    fName: string;
    lName: string;
    profileId: string;
    profileUrl: string;
    userId: string;
    accountId: string;
    accountGroupId: number;
    //userType: string;
    name: string;
    registrationNo: string;

    feePlanId: number;
    challanBreakups: Array<FeeChallanSummary>;
    challanSummary: FeeChallanSummary;
    feeChallansTotal: number;
    feePlanScheduleTotal: number;

    constructor(model: any = {}){
        this.id = model.id;
        this.name = model.name;
        this.address = model.address;
        this.bloodGroup = model.bloodGroup;
        this.birthday = model.birthday;
        this.email = model.email;
        this.phone = model.phone;
        this.fName = model.fName;
        this.lName = model.lName;
        this.profileId = model.profileId;
        this.profileUrl = model.profileUrl;
        this.userId = model.userId;


        this.accountId = model.accountId;
        this.accountGroupId = model.accountGroupId;
        this.registrationNo = model.registrationNo;

        this.feePlanId = model.feePlanId;
        this.challanBreakups = (model.challanBreakups ||  []).map(r => new FeeChallanSummary(r));
        this.challanSummary = new FeeChallanSummary(model.challanSummary);

        //this.feePlanSummary = model.feePlanSummary;
        this.feeChallansTotal = model.feeChallansTotal;
        this.feePlanScheduleTotal = model.feePlanScheduleTotal;
    }
    //get name(){ return `${this.fName} ${this.lName}`}

    get advance(){ return this.challanSummary.advance; }
    get balance(){ return this.challanSummary.balance; }
    get dueFee(){ return this.challanSummary.dueFee; }
    get paid(){ return this.challanSummary.paid; }
    get totalFee(){ return this.challanSummary.totalFee; }

    get isFeeSynced(){ return (this.feePlanScheduleTotal == this.challanSummary.totalFee) && (this.feeChallansTotal == this.feePlanScheduleTotal); }
}

export class StudentSummarySerializer {
    fromJson(json: any): StudentSummary { return new StudentSummary(json); }

    toJson(data: any): any {
        let info = {};
        return info;
    }
}
