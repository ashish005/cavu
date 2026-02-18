import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class PricingLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList = [
        {
            isFLatChildren: true, key: 'Subscriptions',
            children:[
                { routeTo: ['info'], icon:"fa fa-home", key: 'License info' },
                { routeTo: ['payment'], icon:"fa fa-home", key: 'payment' }
            ]
        },
        {
            isFLatChildren: true, key: 'Others',
            children:[
                { id: 1, routeTo: ['license-history'], icon:"fa fa-history", key: 'License history' },
                { id: 2, routeTo: ['invoices'], icon:"fa fa-calendar", key: 'invoices' }
            ]
        }
    ];
    constructor(private router: Router, public activatedRoute: ActivatedRoute){}
    ngOnInit(){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}