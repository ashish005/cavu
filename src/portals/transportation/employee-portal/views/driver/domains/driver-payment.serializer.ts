import {CoreQueryOptions, CoreResource} from "@app-global";

export class DriverPaymentQueryOptions extends CoreQueryOptions{
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

export class DriverPayment extends CoreResource
{
    override id: number;
    payoutId: number;
    trxnModeId: number;
    transactionId: number;
    voucherTypeId: number;
    partyId: string;
    userId: string;

    voucherNo: string;
    voucherDate: string;
    netAmount: number;
    remark: string;

    trxnModeName: string;
    head: string;
    roles: Array<string>;
    constructor(model: any = <any>{}){
        super();
        const {
            id, payoutId, trxnModeId, transactionId, voucherTypeId, partyId, userId,
            voucherNo, voucherDate, netAmount, remark, trxnModeName, head, roles
        } = model;
        this.id = id;
        this.payoutId = payoutId;
        this.trxnModeId = trxnModeId;
        this.transactionId = transactionId;
        this.voucherTypeId = voucherTypeId;
        this.partyId = partyId;
        this.userId = userId;

        this.voucherNo = voucherNo;
        this.voucherDate = voucherDate;
        this.netAmount = netAmount;
        this.remark = remark;
        this.trxnModeName = trxnModeName;
        this.head = head;
        this.roles = roles;
    }
}

export class DriverPaymentSerializer {
  fromJson(json: any): DriverPayment { return new DriverPayment(json); }
  toJson(model: any): any {return model;}
}
