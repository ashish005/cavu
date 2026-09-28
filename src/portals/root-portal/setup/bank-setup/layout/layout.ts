import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './layout.html'
})
export class BankSetupLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'bank/info', key: "Banks", sortOrder: 1 },
        { id:2, icon:"fa fa-university", routeTo: ['config', 'bank-transaction-type'], key: `Transaction Types`, sortOrder: 2 },
        { id:3, icon:"fa fa-university", routeTo: ['config', 'card'], key: `Card`, sortOrder: 3 },
        { id:4, icon:"fa fa-university", routeTo: ['config', 'bank-account-type'], key: `Account Types`, sortOrder: 4 },
        { id:5, icon:"fa fa-university", routeTo: ['config', 'bank-identifier-type'], key: `Identifier Types`, sortOrder: 5 }
    ];

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}