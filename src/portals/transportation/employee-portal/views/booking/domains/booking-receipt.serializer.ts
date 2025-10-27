import {CoreQueryOptions, CoreResource} from "@app-global";

export class BookingReceiptQueryOptions extends CoreQueryOptions{
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

export class BookingReceipt extends CoreResource
{
    trackerNo: string;
    receiptId: string;
    reportHeadId: number;
    netAmount: number;

    reportHeadName: string;
    trxnMode: string;
    partyName: string;
    voucherNo: string;
    voucherDate: string;
    voucherTypeId: number;

    vehicleNo: number;
    vehicleModel: number;
    vehicleTypeName: number;
    vehicleManufactureName: number;

    vehicleName: string;

    constructor(model: any = <any>{}){
        super();
        const {
            id, trackerNo, receiptId, reportHeadId, reportHeadName,
            trxnMode, partyName, voucherNo, voucherDate, voucherTypeId, netAmount,
            vehicleNo, vehicleModel, vehicleTypeName, vehicleManufactureName
        } = model;
        this.id = id;
        this.trackerNo = trackerNo;
        this.receiptId = receiptId;
        this.reportHeadId = reportHeadId;

        this.reportHeadName = reportHeadName;
        this.trxnMode = trxnMode;
        this.partyName = partyName;
        this.voucherNo = voucherNo;
        this.voucherDate = voucherDate;
        this.voucherTypeId = voucherTypeId;
        this.netAmount = netAmount;

        this.vehicleNo = vehicleNo;
        this.vehicleModel = vehicleModel;
        this.vehicleTypeName = vehicleTypeName;
        this.vehicleManufactureName = vehicleManufactureName;

        this.vehicleName = `${this.vehicleManufactureName} ${this.vehicleModel}`;
    }
}

export class BookingReceiptSerializer {
  fromJson(json: any): BookingReceipt { return new BookingReceipt(json); }
  toJson(model: any): any {return model;}
}
