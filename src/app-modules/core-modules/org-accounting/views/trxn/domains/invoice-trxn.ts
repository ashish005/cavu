import {CoreQueryOptions, CoreResource } from "@app-global";

export class InvoiceTrxnQueryOptions extends CoreQueryOptions {
    startDate: string;
    endDate: string;
    trxnMasterType: string;

    override toQueryString (){
        const obj = {
            voucherMasterType: this.trxnMasterType
        };
        return super.getParamByObject(obj);
    }
}

export class InvoiceTrxn extends CoreResource {
    head: string;
    amount: number;
    foreignAmount: number;

    voucherNo: string;
    description: string;

    currencyId: number;
    currencyCode: string;
    currencyRate: number;

    voucherTypeId: number;
    voucherTypeName: string;

    postDate: string;
    valueDate: string;

    paymentModeId: number;
    paymentModeName: string;

    constructor(model: any = <any>{}) {
        super();
        const {
            id, head, amount, foreignAmount,
            voucherNo, description,
            currencyRate, currencyId, currencyCode,
            postDate, valueDate,
            voucherTypeId, voucherTypeName,
            paymentModeId, paymentModeName
        } = model;
        this.id = id;
        this.amount = amount;
        this.foreignAmount = foreignAmount;

        this.head = head;
        this.voucherNo = voucherNo;
        this.description = description;

        this.currencyId = currencyId;
        this.currencyCode = currencyCode;
        this.currencyRate = currencyRate || 1;

        this.voucherTypeId = voucherTypeId;
        this.voucherTypeName = voucherTypeName;

        this.postDate = postDate;
        this.valueDate = valueDate;

        this.paymentModeId = paymentModeId;
        this.paymentModeName = paymentModeName;
    }
}

export class InvoiceTrxnSerializer {
    fromJson(json: InvoiceTrxn): InvoiceTrxn { return new InvoiceTrxn(json); }
    toJson(model: any): any { return model; }
}
