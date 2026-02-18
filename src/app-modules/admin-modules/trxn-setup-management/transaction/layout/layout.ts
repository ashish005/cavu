import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BankingAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    templateUrl: './layout.html'
})
export class TrxnLayout {
    public items: Array<any> = [
        { id:3, icon:"fa fa-dashboard", route: 'bank', name: "Connect Online", sortOrder: 1 },
        { id:3, icon:"fa fa-dashboard", route: 'verified', name: "Verified", sortOrder: 2 },
        { id:3, icon:"fa fa-dashboard", route: 'pending', name: "Pending", sortOrder: 3 },
        { id:3, icon:"fa fa-dashboard", route: 'allocation', name: "Allocation", sortOrder: 4 },
    ];
}

@Component({
    standalone: false,
    templateUrl: './sub-layout.html'
})
export class TrxnSubLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    pageTitle: string;
    constructor(public activatedRoute: ActivatedRoute, private router: Router, public apiResolver: BankingAPIResolver){
        const { title } = this.activatedRoute.snapshot.data;
        this.pageTitle = title;
    }

    public items: Array<any> = [
        {
            id:3, icon:"fa fa-dashboard", isHeading: true, name: "Transactions", sortOrder: 3,
            children: [
                { id:3, icon:"fa fa-dashboard", route: 'verified', name: "Verified", sortOrder: 3 },
                { id:3, icon:"fa fa-dashboard", route: 'pending', name: "Pending", sortOrder: 3 }
            ]
        }
    ];

    ngOnInit(){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}