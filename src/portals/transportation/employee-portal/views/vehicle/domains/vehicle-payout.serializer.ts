import {CoreQueryOptions, CoreResource} from "@app-global";

export class VehiclePayoutQueryOptions extends CoreQueryOptions{
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

export class VehiclePayoutDetail extends CoreResource
{
    payoutHeadId: number;
    dueAmount: number;
    taxDeduction: number;
    netAmount: number;
    remark: string;
    constructor(model: any = <any>{}){
        super();
        const {
            id, payoutHeadId, dueAmount, taxDeduction, netAmount, remark
        } = model;
        this.id = id;
        this.payoutHeadId = payoutHeadId;
        this.dueAmount = dueAmount;
        this.taxDeduction = taxDeduction;
        this.netAmount = netAmount;
        this.remark = remark;
    }
}

export class VehiclePayout extends CoreResource
{
    payslipId: number;

    vehicleId: string;
    vehicleNo: string;

    dueAmount: number;
    paidAmount: number;

    month: string;
    year: string;
    otherDeduction: number;
    otherPayble: number;
    dueDate: string;
    paidDate: string;
    paymentStatus: string;
    remark: string;
    payoutDetails: Array<VehiclePayoutDetail>;
    constructor(model: any = <any>{}){
        super();
        const {
            id, payslipId,
            vehicleId, vehicleNo,
            dueAmount, paidAmount, otherDeduction, otherPayble,
            month, year, dueDate, paidDate, remark, paymentStatus,
            payoutDetails
        } = model;
        this.id = id;
        this.payslipId = payslipId;
        this.vehicleId = vehicleId;
        this.vehicleNo = vehicleNo;

        this.dueAmount = dueAmount;
        this.paidAmount = paidAmount;

        this.month = month;
        this.year = year;
        this.otherDeduction = otherDeduction;
        this.otherPayble = otherPayble;
        this.dueDate = dueDate;
        this.paidDate = paidDate;
        this.paymentStatus = paymentStatus;
        this.remark = remark;
        this.payoutDetails = payoutDetails?.map(r => new VehiclePayoutDetail(r));
    }
}

export class VehiclePayoutSerializer {
  fromJson(json: any): VehiclePayout { return new VehiclePayout(json); }
  toJson(model: any): any {return model;}
}
