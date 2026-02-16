import {Component, ElementRef, Input, OnDestroy, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NumberCell, DateFormatCell, ViewExtender, CurrencyCell} from "@app-global";
import {DayBook, DayBookQueryOptions} from "../domains/day-book.serializer";
import {DayBookService} from "../services/account-book.service";
import {VoucherCellComponent} from "../grid-action-cell";

@Component({
  standalone: false,
  templateUrl: './templates/book.html'
})
export class DayBookView extends ViewExtender<DayBook> implements OnDestroy {
  override coreState: DayBookQueryOptions = new DayBookQueryOptions();
  constructor(public override service: DayBookService, public override activatedRoute: ActivatedRoute) {
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
          // {headerName: 'Entry Date', field: 'entryDate', cellTemplate: DateFormatCell},
          // {headerName: 'Entry By', field: 'entryBy' }
      ];
  }

  ngOnInit(){ }
  override ngOnDestroy(){ super.ngOnDestroy();}

    addRecord(){
        //this.apiResolver.showVoucherPopup({ }, {text: `Create New`, desc: `` });
    }

    actionCb(row: DayBook){
       ///this.apiResolver.showVoucherPopup({ ...row }, {text: `${row.voucherNo}`, desc: `` });
    }

  searchActionCb(row: any)
  {
      this.coreState.accountId = row.accountId;
      this.coreState.startDate = row.startDate;
      this.coreState.endDate = row.endDate;
    super.updateGrid(this.coreState);
  }

  override actionRemoveCb(row){
    const success = ()=>{ super.populateGrid(); };
    const failure = (e)=>{ console.log(e); };
    //this.apiResolver.deleteVoucher(row.voucherId, row.voucherTypeId).subscribe(success, failure);
  }
}
