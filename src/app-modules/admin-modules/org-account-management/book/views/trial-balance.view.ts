import {Component, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NumberCell, ViewExtender} from "@app-global";
import {TrialBalance, TrialBalanceQueryOptions} from "../domains/trial-balance/trial-balance.serializer";
import {TrialBalanceByGroupService} from "../services/account-book.service";
import {TrialAccountGroupNameCell} from "../grid-action-cell/trial-balance-grid-cell.component";

@Component({
  standalone: false,
    templateUrl: './templates/trial-balance.html'
})
export class TrialBalanceView extends ViewExtender<TrialBalance> implements OnInit, OnDestroy {
    override coreState: TrialBalanceQueryOptions = new TrialBalanceQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: TrialBalanceByGroupService){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Account Group', field: 'head', cellTemplate: TrialAccountGroupNameCell },
            {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell},
        ];
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit() {
        // this.coreState.accountGroupId = this.activatedRoute.snapshot.params.accountGroupId;
        /*this.paramsSubscription = this.activatedRoute.queryParams.subscribe(params => {
            this.coreState.accountGroupId = params['groupId'];
            // Trigger your refresh logic here
            this.populateGrid();
        });*/
    }

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }

  actionCb(e: any) {}
}
