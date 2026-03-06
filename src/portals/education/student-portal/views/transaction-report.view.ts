import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ViewExtender} from "@app-global";
import {TransactionService} from "../services/transaction.service";
import {OnlineTransaction, OnlineTransactionQueryOptions} from "../domains/online-transaction.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/transation-report.html',
    styles: [`:host { display: contents;}`]
})
export class TransationReportView extends ViewExtender<OnlineTransaction> implements OnInit {
    public accountId: any;
    override coreState: OnlineTransactionQueryOptions = new OnlineTransactionQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service:  TransactionService){
        super(activatedRoute, service);
        this.gridOptions.columnDefs =  [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Created Date', field: 'createdDate'},
            {headerName: 'modified By', field: 'modifiedBy'},
            {headerName: 'modified Date', field: 'modifiedDate'},
        ];
    }

    ngOnInit(){
        //this.coreState.accountId = this.coreService.currentUser.accountId;
        super.populateGrid();
    }
    actionCb(e){}
}