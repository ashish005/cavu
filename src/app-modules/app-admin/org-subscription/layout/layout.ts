import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './layout.html'
})
export class PricingLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.license',
            children:[
                { routeTo: ['info'], icon:"fa fa-home", key: 'mainLayout.license.info' },
                { routeTo: ['payment'], icon:"fa fa-home", key: 'mainLayout.license.payment' }
            ]
        },
        {
            isFLatChildren: true, key: 'mainLayout.heading.others',
            children:[
                { id: 1, routeTo: ['license-history'], icon:"fa fa-history", key: 'mainLayout.license.history' },
                { id: 2, routeTo: ['invoices'], icon:"fa fa-calendar", key: 'mainLayout.license.invoice' }
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