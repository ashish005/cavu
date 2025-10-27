import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({ templateUrl: './layout.html' })
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
        { id:3, icon:"fa fa-university", routeTo: ['config', 'card'], key: `Card`, sortOrder: 2 },
        { id:4, icon:"fa fa-university", routeTo: ['config', 'payment-Type'], key: `Payment Types`, sortOrder: 3 },
        //{ id:1, icon:"fa fa-dashboard", route: 'gateway/list', name: "Payment Gateway", sortOrder: 3 },
    ];

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}