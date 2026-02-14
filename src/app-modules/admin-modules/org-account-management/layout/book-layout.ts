import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedService} from "@app-global";
import {LayoutExtension} from "./layout-extension";

@Component({
  standalone: false,
  templateUrl: './templates/book-layout.html'
})
export class BookLayout extends LayoutExtension implements OnInit {
    constructor(public activatedRoute: ActivatedRoute, public sharedService: SharedService){
        super();
        this.layout = this.activatedRoute.snapshot.data;
    }
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
