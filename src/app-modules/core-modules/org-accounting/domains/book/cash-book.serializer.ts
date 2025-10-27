import {CoreQueryOptions, CoreResource, DateHelper} from "@app-global";
import {BookSummaryData} from "./book-summary-data";

export class CashBookQueryOptions extends CoreQueryOptions{
    accountId: string;
    startDate: string;
    endDate: string;
    override toQueryString (){
        const obj = {
            accountId:this.accountId,
            fromDate: this.startDate,
            toDate: this.endDate
            // fromDate: new Date(this.startDate).toISOString(),
            // toDate: new Date(this.endDate).toISOString()
        };
        const params = super.getParamByObject(obj);
        return params;
    }
}

export class CashBook extends CoreResource{
  head: string;
  extraInfo: string;
  trxnDate: Date;
  credit: string;
  debit: string;
  balance: string;
  entryBy: string;
  entryDate: Date;
  description: string;
  voucherTypeName: string;
  voucherMasterType: string;
  voucherNo: string;
  voucherTypeId: number;
  voucherId: number;

  constructor(model: any = <any>{}){
    super();
    this.head = model.head;
    this.extraInfo = model.extraInfo;
    this.trxnDate = model.trxnDate;
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
  }
}

export class CashBookSerializer{
  fromDataJson(json: BookSummaryData): BookSummaryData { return new BookSummaryData(json); }
  fromJson(json: CashBook): CashBook {
    return new CashBook(json);
  }

  toJson(model: any): any {
    return {};
  }
}
