import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CurrencyCell, DateFormatCell, NumberCell, ViewExtender} from "@app-global";
import {BankLedger, BankLedgerQueryOptions} from "../../domains/book/bank-ledger.serializer";
import {BankLedgerService} from "../../services/account-book.service";
import {VoucherCellComponent} from "../../grid-action-cell";

@Component({
  standalone: false,
  templateUrl: './templates/book.html'
})
export class BankLedgerView extends ViewExtender<BankLedger> implements OnDestroy {
  override coreState: BankLedgerQueryOptions = new BankLedgerQueryOptions();
  constructor(public override service: BankLedgerService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Date', field: 'trxnDate', cellTemplate: DateFormatCell},
          {headerName: 'Particulars', field: 'head' },
          {headerName: 'Voucher Type', field: 'voucherTypeName' },
          {headerName: 'Voucher No', field: 'voucherNo', cellTemplate: VoucherCellComponent  },

          {headerName: 'Trxn Type', field: 'paymentMode' },
          {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: CurrencyCell },
          {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: CurrencyCell },
          {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: CurrencyCell }
      ];
  }

  ngOnInit() {}

  searchActionCb(row: any){
      this.coreState.accountId = row.accountId;
      this.coreState.startDate = row.startDate;
      this.coreState.endDate = row.endDate;
    super.populateGrid();
  }

  override ngOnDestroy(){ super.ngOnDestroy(); }

    addRecord(){
        //this.apiResolver.showVoucherPopup({ }, {text: `Create New`, desc: `` });
    }

    actionCb(row: BankLedger){
        //this.apiResolver.showVoucherPopup({ ...row }, {text: `${row.voucherNo}`, desc: `` });
    }
}
