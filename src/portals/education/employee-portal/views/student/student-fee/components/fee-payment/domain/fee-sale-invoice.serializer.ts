import {CoreQueryOptions} from "@app-global";

export class SaleInvoiceQueryOptions extends CoreQueryOptions{}

class ReceiptRequest
{
  id: string;
  voucherTypeId: number;
  partyId: string;
  userId: string;
  voucherNo: string;
  saleDate: Date;
  paymentModeId: number;
  totalAmount: number;
  payAmount: number;
  paymentGatewayId: number;
  gatewayAccountId: string;
  gatewayAccountGroupId: number;
  referenceTransactionNo: string;
  refVoucherId: number;
  refVoucherNo: string;
  refVoucherTypeId: number;

  constructor(data: any = <any>{}){
    this.id = data.id;
    this.voucherTypeId = data.voucherTypeId;
    this.partyId =  data.partyId;
    this.userId =  data.userId;
    this.voucherNo = data.voucherNo;
    this.saleDate = data.saleDate;
    this.paymentModeId =  data.paymentModeId;
    this.totalAmount =  data.totalAmount;
    this.payAmount =  data.payAmount;
    this.paymentGatewayId =  data.paymentGatewayId;
    this.gatewayAccountId =  data.gatewayAccountId;
    this.gatewayAccountGroupId =  data.gatewayAccountGroupId;
    this.referenceTransactionNo =  data.referenceTransactionNo;
    this.refVoucherId = data.refVoucherId;
    this.refVoucherNo = data.refVoucherNo;
    this.refVoucherTypeId = data.refVoucherTypeId;
  }
}

class SaleVoucher
{
  salesVoucherId: number;
  headAccountId: string;
  headAccountGroupId: number;
  productId: number;
  productVariantId: number;
  MRP: number;
  price: number;
  baseUnitTypeId: number;
  quantity: number;
  constructor(model: any = <any>{}){
    this.headAccountId = model.headAccountId;
    this.headAccountGroupId = model.headAccountGroupId;
    this.salesVoucherId = model.salesVoucherId;
    this.productId = model.productId;
    this.productVariantId = model.productVariantId;
    this.MRP = model.MRP;
    this.price = model.price;
    this.baseUnitTypeId = model.baseUnitTypeId;
    this.quantity = model.quantity;
  }
}

export class FeeSaleInvoice {
  id: string;
  isVoucherInvoice: boolean;
  voucherTypeId: number;
  partyId: string;
  userId: string;
  invoiceNo: string;
  saleDate: Date;
  refVoucherId: number;
  refVoucherNo: number;
  refVoucherTypeId: number;
  receiptRequests: Array<ReceiptRequest>;

  constructor(model: any = <any>{}){
    this.id = model.id;
    this.isVoucherInvoice = model.isVoucherInvoice;
    this.voucherTypeId = model.voucherTypeId;
    this.partyId = model.partyId;
    this.userId = model.userId;
    this.invoiceNo = model.invoiceNo;
    this.saleDate = model.saleDate;
    this.refVoucherId = model.refVoucherId;
    this.refVoucherNo = model.refVoucherNo;
    this.refVoucherTypeId = model.refVoucherTypeId;
    this.receiptRequests = (model.receiptRequests || []).map(r => new ReceiptRequest(r));
  }
}

export class FeeSaleInvoiceSerializer {
  fromJson(json: any): FeeSaleInvoice { return new FeeSaleInvoice(json); }

  toJson(data: any): any {
   const saleVoucher = (data.saleVoucher || []).map(r => {
     r.sundryDetail = (r.sundryDetail || []).filter(k => k.sundryTypeId);
     return r;
   });

   const paymentInfo = data.payment;
    if(!paymentInfo.id){
     delete paymentInfo.id;
    }
    const saleReq = {
      payment: paymentInfo,
      saleVoucher: saleVoucher,
      receipt: data.receipt
    };

    return saleReq;
  }
}

