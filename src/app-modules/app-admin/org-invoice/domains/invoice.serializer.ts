import {CoreQueryOptions, CoreResource} from "@app-global";

export class InvoiceQueryOptions extends CoreQueryOptions {
    voucherTypeId: string;
    voucherMasterType: string;
    constructor(model: any = {}){
        super(model);
        this.voucherTypeId = model.voucherTypeId || '';
        this.voucherMasterType = model.voucherMasterType || '';
    }

    override toQueryString (){
        const obj = {
            voucherTypeId: this.voucherTypeId,
            voucherMasterType: this.voucherMasterType
        };
        return super.getParamByObject(obj);
    }
}

class VoucherCommon extends CoreResource {
    trxnId: number;
    voucherId: string;
    voucherNo: string;
    netAmount: number;
    voucherDate: string;
    isItemInvoice: boolean;
    remark: string;

    voucherMasterType: string;
    voucherTypeName: string;
    voucherTypeId: number;

    projectId: number;
    partyId: number;
    partyName: string;
    partyPrintName: string;

    constructor(model: any = <any>{}){
        super();
        const {
            trxnId,
            voucherId, voucherNo, netAmount, voucherDate, isItemInvoice, remark,
            voucherMasterType, voucherTypeName, voucherTypeId,
            partyId, partyName, partyPrintName,
            projectId
        } = model;
        this.trxnId = trxnId;
        this.voucherId = voucherId;
        this.voucherNo = voucherNo;
        this.netAmount = netAmount;
        this.voucherDate = voucherDate;
        this.isItemInvoice = isItemInvoice;
        this.remark = remark;

        this.voucherMasterType = voucherMasterType;
        this.voucherTypeName = voucherTypeName;
        this.voucherTypeId = voucherTypeId;

        this.projectId = projectId;

        this.partyId = partyId;
        this.partyName = partyName;
        this.partyPrintName = partyPrintName;
    }
}

export class OrgInvoice extends VoucherCommon {
  override id: any;
    currencyCode: string;
    currencyId: number;
    currencyRate: number;

    constructor(model: any = <any>{}){
        super(model);
        const {
            currencyCode, currencyId, currencyRate,
            voucherTypeId, voucherMasterType, voucherTypeName
        } = model;
        this.currencyCode = currencyCode;
        this.currencyId = currencyId;
        this.currencyRate = currencyRate;
    }
}

export class OrgInvoiceSerializer {
    fromJson(json: any): OrgInvoice { return new OrgInvoice(json); }
    toJson(model: any): any { return model; }
}
