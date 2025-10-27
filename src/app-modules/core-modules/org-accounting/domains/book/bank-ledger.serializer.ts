import {CoreQueryOptions, CoreResource, DateHelper} from "@app-global";
import {BookSummaryData} from "./book-summary-data";

export class BankLedgerQueryOptions extends CoreQueryOptions{
    accountId: string;
    startDate: string;
    endDate: string;

    override toQueryString (){
        const obj = {
            accountId:this.accountId,
            fromDate: this.startDate,
            toDate: this.endDate
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class BankLedger extends CoreResource{
  head: string;
  credit: string;
  debit: string;
  balance: number;
  description: string;
  entryBy: string;
  entryDate: Date;
  voucherDate: Date;
  voucherTypeName: string;
  voucherMasterType: string;
  voucherNo: string;
  voucherTypeId: number;
  voucherId: number;

  paymentMode: string;
  trxnDate: string;

  constructor(model: any = <any>{}){
    super();
    this.head = model.head;
    this.voucherDate = model.voucherDate;
    this.credit = model.credit;
    this.debit = model.debit;
    this.balance = model.balance;
    this.entryBy = model.entryBy;
    this.entryDate = model.entryDate;
    this.description = model.description;
    this.voucherTypeName = model.voucherTypeName;
    this.voucherMasterType = model.voucherMasterType;
    this.voucherNo = model.voucherNo;
    this.voucherTypeId = model.voucherTypeId;
    this.voucherId = model.voucherId;

    this.paymentMode = model.paymentMode;
    this.trxnDate = model.trxnDate;
  }
}

export class BankLedgerSerializer{
    fromDataJson(json: BookSummaryData): BookSummaryData { return new BookSummaryData(json); }
  fromJson(json: BankLedger): BankLedger {
    return new BankLedger(json);
  }

  toJson(model: any): any {
    return {
      head: model.head,
      extraInfo: model.extraInfo,
      voucherDate: model.voucherDate,
      credit: model.credit,
      debit:  model.debit,
      entryBy: model.entryBy,
      entryDate: model.entryDate,
      description:  model.description,
      voucherType: model.voucherType,
      voucherMasterType: model.voucherMasterType,
      voucherNo: model.voucherNo,
      voucherTypeId: model.voucherTypeId,
      voucherId: model.voucherId
    };
  }
}
