import {CoreQueryOptions, CoreResource, StringHelper} from "@app-global";

export class QuotationQueryOptions extends CoreQueryOptions {
    startDate: string;
    endDate: string;

    accountId: string;
    projectId: string;
    productId: string;

    orgUserId: string;

  override toQueryString ()
  {
      const obj = {
          //invoiceMasterType: VOUCHER_TYPES.QUOTATION,
          startDate: this.startDate,
          endDate: this.endDate,
          accountId: this.accountId,
          projectId: this.projectId,
          productId: this.productId,
          orgUserId: this.orgUserId
      };
      return super.getParamByObject(obj);
  }
}

export class Quotation extends CoreResource {
    voucherId: number;
    voucherNo: string;
    voucherDate: string;
    defaultAccountId: string;
    defaultAccountGroupId: number;
    voucherMasterType: string;
    voucherType: string;

    isItemInvoice: boolean;
    valueDate: string;
    remark: string;

    voucherTypeId: number;
    subTypeId: number;

    transactionId: number;

    subTotal: number;
    discount: number;
    taxAmount: number;
    netAmount: number;

    // Party details begin
    partyId: string;
    partyUserId: string;
    partyName: string;
    partyGroupId: number;
    creditDaysPurchase: number;
    creditDaysSale: number;
    creditLimit: number;
    openingBalance: number;
    // Party details end

    //trxn: InvoiceTrxn;
    currencyCode: string; // for ui handling
    subTypeName: string;

    amount: number;
    foreignBalance: number;
    foreignAmount: number;
    //invoiceStatus: InvoiceStatus;

    packingCharge: number;
    deliveryCharge: number;
    roundingMethodId: number;
    rounding: number;
    offerRuleId: number;
    isTaxable: boolean;
    inDraft: boolean;
    phases: Array<any>;
    voucherStatus: string;
  constructor(model: any = <any>{})
  {
      super();
      const {
          voucherId, voucherNo, voucherDate, defaultAccountId, defaultAccountGroupId, voucherMasterType, voucherType,
          isItemInvoice, valueDate, remark,
          voucherTypeId, subTypeId,
          transactionId,
          subTotal, discount, taxAmount, amount, netAmount,
          // Party details begin
          partyId, partyUserId, partyName, partyGroupId, creditDaysPurchase, creditDaysSale, creditLimit, openingBalance,
          trxn,
          balance, credit, debit,
          subTypeName,
          packingCharge, deliveryCharge, roundingMethodId, rounding, offerRuleId, isTaxable, inDraft,
          phases, voucherStatus
      } = model;

      this.voucherId = voucherId;
      this.voucherNo = voucherNo;
      this.voucherDate = voucherDate;
      this.defaultAccountId = defaultAccountId;
      this.defaultAccountGroupId = defaultAccountGroupId;
      this.voucherMasterType = voucherMasterType;
      this.voucherType = voucherType;

      this.isItemInvoice = isItemInvoice;

      this.valueDate = valueDate;
      this.remark = remark;

      this.voucherTypeId = voucherTypeId;
      this.subTypeId = subTypeId;

      this.transactionId = transactionId;

      this.subTotal = subTotal;
      this.discount = discount;
      this.taxAmount = taxAmount;
      this.netAmount = netAmount;

      // Party details begin
      this.partyId = partyId;
      this.partyUserId = partyUserId;
      this.partyName = partyName;
      this.partyGroupId = partyGroupId;
      this.creditDaysPurchase = creditDaysPurchase;
      this.creditDaysSale = creditDaysSale;
      this.creditLimit = creditLimit;
      this.openingBalance = openingBalance;
      // Party details ends
      //this.trxn = new InvoiceTrxn(trxn || {});

      this.currencyCode = trxn?.currencyCode;// for ui handling
      this.subTypeName = subTypeName;

      //this.invoiceStatus = invoiceStatus ? new InvoiceStatus(invoiceStatus || {}): null;
      this.amount = amount;
      // this.foreignBalance = StringHelper.tillDecimalPlaces((amount || 0)/trxn.currencyRate);
      // this.foreignAmount = StringHelper.tillDecimalPlaces(this.netAmount /trxn.currencyRate);

      this.packingCharge = packingCharge;
      this.deliveryCharge = deliveryCharge;
      this.roundingMethodId = roundingMethodId;
      this.rounding = rounding;
      this.offerRuleId = offerRuleId;
      this.isTaxable = isTaxable;
      this.inDraft = inDraft;
      this.voucherStatus = voucherStatus;

      this.phases = (phases || []).map(r => r);
  }
}

export class QuotationSerializer{
  fromJson(json: Quotation): Quotation {
      return new Quotation(json);
  }
  toJson(model: any): any { return model; }
}
