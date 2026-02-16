import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './templates/book-layout.html'
})
export class BookLayout implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    page: any;
    public layout: any;
    public componentRef: any;
    public searchFilter: any;

    onActivate(componentRef){
        this.page = componentRef.activatedRoute.snapshot.data;
        this.componentRef = componentRef;
        if(this.searchFilter){
            if(componentRef.coreState.accountId){
                this.searchFilter.accountId = componentRef.coreState.accountId;
            }

            this.componentRef.searchActionCb(this.searchFilter);
        }
    }

    searchActionCb(row: any) {
        this.searchFilter = row;
        this.componentRef?.searchActionCb(row);
    }
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){}
    asideData: any = {
        title: 'Finance',
        navList: [
            {
                name: "Trial", show: true,
                children:[
                    { routeTo: ['trial-balance'], icon:"", code:"FIN_ACC_BOOK", name: "Trial Balance" },
                    { routeTo: ['ledger-trial-balance'], icon:"", code:"FIN_ACC_BOOK", name: "Trial Balance - Ledger" },
                    { routeTo: ['ledger-report-monthly'], icon:"", code:"FIN_ACC_BOOK", name: "Trial Balance - Monthly" }
                ]
            },
            {
                name: "Day Book", show: false,
                children:[
                    { routeTo: ['day-book'], icon:"", code:"FIN_DAY_BOOK", name: "Day Book" }
                ]
            },
            {
                name: "Account Book", show: true,
                children:[
                    { routeTo: ['account-book'], icon:"", code:"FIN_ACC_BOOK", name: "Ledger" },
                    { routeTo: ['cash-book'], icon:"", code:"FIN_CASH_BOOK", name: "Cash Book" },
                    { routeTo: ['bank-ledger'], icon:"", code: "FIN_BNK_LEDGER", name: "Bank Ledger" },
                    // { routeTo: ['purchase-book'], icon:"", code:"FIN_ACC_BOOK", name: "Purchase Register" },
                    // { routeTo: ['sale-book'], icon:"", code:"FIN_ACC_BOOK", name: "Sale Register" },
                    // { routeTo: ['journal-book'], icon:"", code:"FIN_ACC_BOOK", name: "Journal Register" }
                ]
            }
        ]
    };
    ngOnInit(){}
}
