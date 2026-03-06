import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {BatchReceipt, BatchReceiptQueryOptions} from "../domain/batch-receipt.serializer";
import {ActivatedRoute, Router} from "@angular/router";
import {BatchFeeReceiptService} from "../services/fee-receipt-invoice.service";
import {DateFormatCell, FullDateFormatCell, ViewExtender} from "@app-global";

@Component({
    standalone: false,
  selector: 'batch-receipt',
  templateUrl: './templates/batch-receipt.html',
  styles: [`:host { display: contents;}`]
})
export class BatchReceiptComponent extends ViewExtender<BatchReceipt> implements OnInit {
  @Input() accountId: string;
    hasTopBorder: boolean= false;
override coreState: BatchReceiptQueryOptions = new BatchReceiptQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute, public override service: BatchFeeReceiptService) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Head', field: 'head' },
          {headerName: 'Voucher Type', field: 'voucherTypeName' },
          {headerName: 'Voucher No', field: 'voucherNo' },
          {headerName: 'Voucher Date', field: 'voucherDate', cellTemplate: DateFormatCell },
          // {headerName: 'Credit', field: 'credit', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell },
          // {headerName: 'Debit', field: 'debit', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell },
          {headerName: 'Entry Date', field: 'entryDate', cellTemplate: FullDateFormatCell}
      ];
  }

  ngOnInit() {
      (<BatchReceiptQueryOptions>this.coreState).accountId = this.accountId;
      super.populateGrid();
  }
  actionCb(e){}
}
