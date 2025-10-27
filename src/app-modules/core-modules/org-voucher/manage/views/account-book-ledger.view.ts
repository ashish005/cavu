import {Component, Input, OnInit} from "@angular/core";
import {DateFormatCell, NumberCell, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {AccountBook, AccountBookQueryOptions} from "../domains/account-book.serializer";
import {AccountBookService} from "../services/account-book.service";

@Component({
  standalone: false,
    templateUrl: `./templates/account/account-book-ledger.html`,
    styles: [`:host { display: contents;}`]
})
export class AccountBookLedgerInfoView extends ViewExtender<AccountBook> implements OnInit {
    @Input() accountId: string;
    override coreState: AccountBookQueryOptions = new AccountBookQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: AccountBookService) {
        super(activatedRoute,service);
        this.gridOptions.columnDefs = [
            {headerName: 'Head', field: 'head' },
            {headerName: 'Voucher Type', field: 'voucherTypeName' },
            {headerName: 'Voucher No', field: 'voucherNo' },
            {headerName: 'Voucher Date', field: 'voucherDate', cellTemplate: DateFormatCell},
            {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell  },
            {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell  },
            {headerName: 'Entry Date', field: 'trxnDate', cellTemplate: DateFormatCell },
            {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell  }
        ];
    }
    ngOnInit(){
        (<AccountBookQueryOptions>this.coreState).accountId = this.accountId;
        super.populateGrid();
    }
    actionCb(row: any){ this.gridRow = row; }
}
