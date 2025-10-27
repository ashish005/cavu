import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NumberCell, DateFormatCell, ViewExtender, CurrencyCell} from "@app-global";
import {CashBook, CashBookQueryOptions} from "../../domains/book/cash-book.serializer";
import {CashBookService} from "../../services/account-book.service";
import {VoucherCellComponent} from "../../grid-action-cell";

@Component({
  standalone: false,
  templateUrl: './templates/book.html'
})
export class CashBookView extends ViewExtender<CashBook> implements OnDestroy{
    override coreState: CashBookQueryOptions = new CashBookQueryOptions();
  constructor(public override service: CashBookService, public override activatedRoute: ActivatedRoute) {
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
  }

  ngOnInit(){}
  override ngOnDestroy(){ super.ngOnDestroy();}

  searchActionCb(row: any){
      this.coreState.accountId = row.accountId;
      this.coreState.startDate = row.startDate;
      this.coreState.endDate = row.endDate;
    this.updateGrid(this.coreState);
  }

  override actionRemoveCb(row){
    const success = ()=>{ this.populateGrid(); };
    const failure = (e)=>{ console.log(e);};
    //this.apiResolver.deleteVoucher(row.voucherId, row.voucherTypeId).subscribe(success, failure);
  }

  addRecord(){
     //this.apiResolver.showVoucherPopup({ }, {text: `Create New`, desc: `` });
  }

  actionCb(row: CashBook){
    //this.apiResolver.showVoucherPopup({ ...row }, {text: `${row.voucherNo}`, desc: `` });
  }
}
