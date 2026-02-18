import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    standalone: false,
    templateUrl: './templates/org-setup.html',
    styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class OrgSetupLayout {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;

    public navList: Array<any>;

    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){
        const { translatePath } = this.activatedRoute.snapshot.data;
        this.navList = [
            {
                key: `Bank`, isFLatChildren: true,
                children:[
                    { id:1, icon:"fa fa-university", routeTo: ['bank-setup', 'bank'], key: `Bank Setup`, sortOrder: 1 },
                    { id:2, icon:"fa fa-university", routeTo: ['bank-setup', 'config', 'card'], key: `Card`, sortOrder: 1 },
                    { id:2, icon:"fa fa-university", routeTo: ['bank-setup', 'config', 'payment-Type'], key: `Payment Types`, sortOrder: 1 }
                ]
            },
            {
                key: `Bank Integration`, isFLatChildren: true,
                children:[
                    { id:2, icon:"fa fa-cc-visa", routeTo: ['bank-trxn'], key: 'Bank Integration', sortOrder: 2 }
                ]
            },
            {
                key: `Voucher Setup`, isFLatChildren: true,
                children:[
                    { id:3, icon:"fa fa-university", routeTo: ['voucher-setup'], key: `Voucher`, sortOrder: 3 }
                ]
            },
            {
                key: `Gateway Setup`, isFLatChildren: true,
                children:[
                    { id:5, icon:"fa fa-dashboard", routeTo: 'payment-gateway', key: `Gateway Setup`, sortOrder: 4 }
                ]
            }
        ];
    }
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}