import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {InvoiceCurrencyCell, CurrencyCell, ViewExtender, FullDateFormatCell} from "@app-global";
import {InvoiceTrxn, InvoiceTrxnQueryOptions} from "../domains/invoice-trxn";
import {InvoiceTrxnService} from "../services/invoice-trxn.service";

@Component({
  standalone: false,
  templateUrl: './templates/trxn.html',
  styles: [`:host { display: contents;}`]
})
export class InvoiceTrxnView extends ViewExtender<InvoiceTrxn> implements OnInit, OnDestroy {
    override coreState: InvoiceTrxnQueryOptions = new InvoiceTrxnQueryOptions();
    constructor(public override service: InvoiceTrxnService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Head', field: 'head' },
            {headerName: 'Voucher No', field: 'voucherNo' },
            {headerName: 'Voucher Type', field: 'voucherTypeName'  },
            {headerName: 'Date', field: 'postDate', cellTemplate: FullDateFormatCell },
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellTemplate: CurrencyCell },
            {headerName: 'Amount(Converted)', field: 'foreignAmount', class: 'text-right', currencyCodeField:'currencyCode', cellTemplate: InvoiceCurrencyCell }
        ];
    }

    ngOnInit(){
      const { key } = this.activatedRoute.snapshot.data;
      this.coreState.trxnMasterType = key;
      super.populateGrid();
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: InvoiceTrxn){ }
}
