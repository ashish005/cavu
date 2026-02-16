import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService, NumberCell, DateFormatCell, ViewExtender, CurrencyCell} from "@app-global";
import {LedgerBookService} from "../services/account-book.service";
import {LedgerBook, LedgerBookQueryOptions} from "../domains/ledger-book.serializer";
import {VoucherCellComponent} from "../grid-action-cell";

@Component({
  standalone: false,
  templateUrl: './templates/book.html',
  styles: [`:host{ display: contents; }`]
})
export class LedgerBookView extends ViewExtender<LedgerBook> implements OnInit, OnDestroy {
  override coreState: LedgerBookQueryOptions = new LedgerBookQueryOptions();
  constructor(public override service: LedgerBookService,
              public override activatedRoute: ActivatedRoute,
              public sharedService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Date', field: 'trxnDate', cellTemplate: DateFormatCell},
          {headerName: 'Particulars', field: 'head' },
          {headerName: 'Voucher Type', field: 'voucherTypeName' },
          {headerName: 'Voucher No', field: 'voucherNo', cellTemplate: VoucherCellComponent  },

          {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: CurrencyCell },
          {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: CurrencyCell },
          {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: CurrencyCell }
      ];
      const { ledgerId } = this.activatedRoute.snapshot.params;
      this.coreState.accountId = ledgerId;
  }

  ngOnInit(){}
  override ngOnDestroy(){ super.ngOnDestroy();}

    searchActionCb(row: any){
        this.coreState.accountId = row.accountId;
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }

    addRecord(){
        //this.apiResolver.showVoucherPopup({ }, {text: `Create New`, desc: `` });
    }

    actionCb(row: LedgerBook){
        //this.apiResolver.showVoucherPopup({ ...row }, {text: `${row.voucherNo}`, desc: `` });
    }

  exportToPDF(){
      this.sharedService.JSONToCSVConvertor(this.gridData, 'Finance : ' + this.pageTitle, true, true);
  }

  exportToExcel(){
      this.sharedService.JSONToCSVConvertor(this.gridData, 'Finance : ' + this.pageTitle, true, true);
  }
}
