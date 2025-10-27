import {CoreQueryOptions} from "@app-global";

export class OrgSoftwareInvoiceQueryOptions extends CoreQueryOptions{}

export class OrgSoftwareInvoice {
    id: number;
    voucherNo: string;
    voucherDate: string;
    customerName: string;
    customerContactNo: string;
    customerEmailId: string;
    customerAddress: string;
    customerTaxNumber: string;
    licenseId: number;
    description: string;
    amount: number;
    tax: number;
    netAmount: number;
    terms: string;

    constructor(model: any = <any>{}){
        const {
            id, voucherNo, voucherDate, customerName, customerContactNo, customerEmailId, customerAddress, customerTaxNumber,
            licenseId, description, amount, tax, netAmount, terms
        } = model;

        this.id = id;
        this.voucherNo = voucherNo;
        this.voucherDate = voucherDate;
        this.customerName = customerName;
        this.customerContactNo = customerContactNo;
        this.customerEmailId = customerEmailId;
        this.customerAddress = customerAddress;
        this.customerTaxNumber = customerTaxNumber;

        this.licenseId = licenseId;
        this.description = description;
        this.amount = amount;
        this.tax = tax;
        this.netAmount = netAmount;
        this.terms = terms;
    }
}

export class OrgSoftwareInvoiceReceipt {
    id: number;
    licenseId: number;
    voucherNo: string;
    voucherDate: string;
    amount: number;
    paymentMode: string;
    paymentReferenceNumber: string;
    remark: string;
    invoiceId: number;

    invoice: OrgSoftwareInvoice;
    constructor(model: any = <any>{}){
        const { id, licenseId, voucherNo, voucherDate, amount, paymentMode, paymentReferenceNumber, remark, invoiceId, invoice } = model;
        this.id = id;
        this.licenseId = licenseId;
        this.voucherNo = voucherNo;
        this.voucherDate = voucherDate;
        this.amount = amount;
        this.paymentMode = paymentMode;
        this.remark = remark;
        this.paymentReferenceNumber = paymentReferenceNumber;
        this.invoiceId = invoiceId;
        this.invoice = new OrgSoftwareInvoice(invoice || {});
    }
}

export class OrgSoftwareInvoiceReceiptSerializer {
  fromJson(json: any): OrgSoftwareInvoiceReceipt { return new OrgSoftwareInvoiceReceipt(json); }

  toJson(data: any): any {
    return data;
  }
}
