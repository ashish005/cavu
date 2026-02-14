import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NumberCell, ViewExtender} from "@app-global";
import {TrialAccountNameCell} from "../../grid-action-cell";
import {TrialBalanceByLedgerService} from "../../services/account-book.service";
import {
    TrialBalanceLedger,
    TrialBalanceLedgerQueryOptions
} from "../../domains/book/trial-balance/trial-balance-ledger.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/ledger-trial-balance.html'
})
export class TrialBalanceByLedgerView extends ViewExtender<TrialBalanceLedger> implements OnInit, OnDestroy {
    @ViewChild('ledgerGroup', { static: true }) public ledgerGroup;
    override coreState: TrialBalanceLedgerQueryOptions = new TrialBalanceLedgerQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: TrialBalanceByLedgerService){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', cellTemplate: TrialAccountNameCell  },
            {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell}
        ];
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit() { }

    searchActionCb(row){
        this.ledgerGroup?.searchActionCb(row);
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }

    showLedgerDetails(item: TrialBalanceLedger){
        this.coreState.skip = 0;
        const { accountGroupId } = item;
        this.coreState.accountGroupId = accountGroupId;
        super.populateGrid();
    }
    actionCb(e: any) {}
}
