import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {DateFormatCell, NumberCell, ViewExtender} from "@app-global";

import {ActivatedRoute} from "@angular/router";
import {AccountBook, AccountBookQueryOptions} from "../domains/account-book.serializer";
import {AccountBookService} from "../services/account-book.service";

@Component({
  standalone: false,
    templateUrl: `./templates/account/account-wise-grid.html`,
    styles: [`:host { display: contents;}`]
})
export class AccountWiseGridReportView extends ViewExtender<AccountBook> implements OnInit {
    @ViewChild('popupOptionsTemplate', {static: true}) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('docPrint', { static: true }) docPrint;
    isDetailView: boolean = true;
    @Input() accountId: string;
    override coreState: AccountBookQueryOptions = new AccountBookQueryOptions();
    tabs: Array<any> = [
        {id: 'invoice', name: 'Invoice', sortOrder: 1},
        {id: 'notify', name: 'Notify', sortOrder: 2},
        {id: 'history', name: 'History', sortOrder: 3}
    ];
    activeTab: any;
    constructor(public activatedRoute: ActivatedRoute, public service: AccountBookService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Head', field: 'head'},
            {headerName: 'Voucher Type', field: 'voucherTypeName'},
            {headerName: 'Voucher No', field: 'voucherNo'},
            {headerName: 'Voucher Date', field: 'voucherDate', cellTemplate: DateFormatCell},
            {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Entry Date', field: 'trxnDate', cellTemplate: DateFormatCell},
            {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell}
        ];
    }

    exportToPDF() {
        //this.sharedService.JSONToCSVConvertor(this.gridData, 'Finance : ', true, true);
    }

    exportToExcel() {
        //this.sharedService.JSONToCSVConvertor(this.gridData, 'Finance : ', true, true);
    }

    ngOnInit() {
        this.coreState.accountId = this.accountId;
        super.populateGrid();
    }

    actionCb(row: AccountBook) {
      super.gridRow = row;
        if(!this.isDetailView) {
            this.openTab(this.tabs[0]);
            const { voucherNo, voucherId, voucherTypeId, voucherMasterType} = super.gridRow;
            this.docPrint.populateReport({
                voucherNo: voucherNo,
                voucherId: voucherId,
                voucherTypeId: voucherTypeId,
                voucherMasterType: voucherMasterType
            }, null);
        };
    }
    changeViewType(isDetailView){
        this.isDetailView  = isDetailView;
    }

    openTab(tab: any) {
        this.activeTab = tab;
    }
}
