import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NumberCell, ViewExtender} from "@app-global";
import {LedgerReportMonthlyService} from "../../services/account-book.service";
import {
    LedgerReportMonthly,
    LedgerReportMonthlyQueryOptions
} from "../../domains/book/trial-balance/ledger-report-monthly.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/book.html',
    providers: [LedgerReportMonthlyService]
})
export class LedgerReportMonthlyView extends ViewExtender<LedgerReportMonthly> implements OnInit, OnDestroy {
    override coreState: LedgerReportMonthlyQueryOptions = new LedgerReportMonthlyQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: LedgerReportMonthlyService){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Duration', field: 'name' },
            {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell}
        ];
        const { ledgerId } = this.activatedRoute.snapshot.params;
        this.coreState.accountId = ledgerId;
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit() {
        /*const { queryParams } = this.activatedRoute.snapshot;
        this.activatedRoute.snapshot.data.title = queryParams.name;*/
    }

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }
  actionCb(e: any) {}
}
