import {CoreQueryOptions, CoreResource} from "@app-global";

export class DriverPayoutQueryOptions extends CoreQueryOptions{
    code: string;

    constructor(data: any = {}){
        super(data);
        this.code = data.code;
    }

    override toQueryString (){
        const obj = {
            code:this.code
        };
        return super.getParamByObject(obj);
    }
}

export class DriverPayout extends CoreResource
{
    driverId: string;
    driverName: string;
    monthYear: string;
    dueAmount: number;
    paidAmount: number;
    balance: number;

    dueDate: string;
    paidDate: string;
    remark: string;
    hasPayslip: boolean;

    otherDeduction: number;
    otherPayble: number;
    constructor(model: any = <any>{}){
        super();
        const {
            id,
            driverId, driverName,
            monthYear, dueAmount, paidAmount, balance, otherDeduction, otherPayble,
            dueDate, paidDate, remark,
            hasPayslip
        } = model;
        this.id = id;
        this.driverId = driverId;
        this.driverName = driverName;

        this.monthYear = monthYear;
        this.dueAmount = dueAmount;
        this.paidAmount = paidAmount;
        this.balance = balance;

        this.otherDeduction = otherDeduction;
        this.otherPayble = otherPayble;

        this.dueDate = dueDate;
        this.paidDate = paidDate;
        this.remark = remark;
        this.hasPayslip = hasPayslip;
    }
}

export class DriverPayoutSerializer {
  fromJson(json: any): DriverPayout { return new DriverPayout(json); }
  toJson(model: any): any {return model;}
}
