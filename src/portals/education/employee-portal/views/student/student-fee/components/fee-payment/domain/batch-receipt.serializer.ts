import {CoreQueryOptions} from "@app-global";

export class BatchReceiptQueryOptions extends CoreQueryOptions{
  accountId: string;

  constructor(model: any = {}){
    super(model);
  }

  override toQueryString (){
    const obj = {
        accountId:this.accountId,
        voucherType: 'receipt'
    };
    const params = super.getParamByObject(obj);
    return params;
  }
}

export class BatchReceipt {
  id: string;
  balance: number;
  voucherId: number;
  voucherTypeId: number;
  voucherDate: string;
  voucherNo: string;
  credit: number;
  debit: number;
  entryDate: string;
  head: string;

  voucherTypeName: string;

  constructor(model: any = <any>{}){
    const { id, balance,  voucherId, voucherTypeId, voucherDate, voucherNo, credit, debit, entryDate, head, voucherTypeName } = model;
    this.id = id;
    this.balance = balance;
    this.voucherId = voucherId;
    this.voucherTypeId = voucherTypeId;
    this.voucherDate = voucherDate;
    this.voucherNo = voucherNo;

    this.credit = credit;
    this.debit = debit;
    this.entryDate = entryDate;
    this.head = head;
    this.voucherTypeName = voucherTypeName;
  }
}

export class BatchReceiptSerializer {
  fromJson(json: any): BatchReceipt { return new BatchReceipt(json); }
  toJson(data: any): any { return {}; }
}
