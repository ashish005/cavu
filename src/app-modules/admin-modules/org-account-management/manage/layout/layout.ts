import {AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
})
export class AccountingLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children: [
                {routeTo: ['ledger'], icon: "fa fa-list-alt", key: "Ledgers"},
                {routeTo: ['book'], icon: "fa fa-book", key: "Books"},
                {routeTo: ['report'], icon: "fa fa-pie-chart", key: "Reports"},
                {routeTo: ['trxn'], icon: "fa fa-exchange", key: "Transactions"},
                {routeTo: ['setup'], icon: "fa fa-cog", key: "Setup"},
            ]
        }
    ];
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}
