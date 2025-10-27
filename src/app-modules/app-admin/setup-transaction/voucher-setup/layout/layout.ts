import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({ templateUrl: './layout.html' })
export class TrxnConfigLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute, private router: Router){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    public items: Array<any> = [
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Voucher Config", sortOrder: 3,
            children: [
                { id:3, icon:"fa fa-dashboard", route: 'voucher', name: "Voucher", sortOrder: 1 }
            ]
        },
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Voucher Sub Info", sortOrder: 3,
            children: [
                { id:1, icon:"fa fa-dashboard", route: 'purchase-type', name: "Purchase Type", sortOrder: 1 },
                { id:2, icon:"fa fa-dashboard", route: 'sale-type', name: "Sale Type", sortOrder: 2 },
                { id:3, icon:"fa fa-dashboard", route: 'quote-type', name: "Quotation Type", sortOrder: 3 },
                { id:4, icon:"fa fa-dashboard", route: 'stock-transfer-type', name: "Stock Transfer Type", sortOrder: 3 },

            ]
        },
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Others", sortOrder: 3,
            children: [
                { id:2, icon:"fa fa-dashboard", route: 'sale-channel', name: "Sale Channel", sortOrder: 1 },
                { id:3, icon:"fa fa-dashboard", route: 'sundry-type', name: "Sundry Type", sortOrder: 2 },
                { id:3, icon:"fa fa-dashboard", route: 'calc-type', name: "CalculationType", sortOrder: 3 }
            ]
        }
    ];

    ngOnInit(){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}