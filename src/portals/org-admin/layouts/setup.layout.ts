import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  templateUrl: './templates/setup.html',
  styles: [`::ng-deep ng-component{ display: contents;}`],
  standalone: false
})
export class SetupLayout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['org-setup'], icon:"fa fa-institution", key: 'Org setup' },
                { routeTo: ['role-permission-setup/role-module'], icon:"fa fa-envelope", key: 'Role & Permissions' },
                { routeTo: ['subscription'], icon:"fa fa-leaf", key: 'Subscription' },
            ]
        },
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['module-access-setup'], icon:"fa fa-user-circle", key: 'User Access Setup' }
            ]
        },
        {
            isFLatChildren: true, key: 'Regulations Tracker',
            children:[
                { routeTo: ['tax-management'], icon:"fa fa-money", key: 'Tax management' },
                { routeTo: ['payroll'], icon:"fa fa-check-square-o", key: 'Payroll' }
            ]
        },
        {
            isFLatChildren: true, key: 'Teams, Workflow & Logs',
            children:[
                { routeTo: ['org-team'], icon:"fa fa-building", key: 'Team' },
                { routeTo: ['notification'], icon:"fa fa-bell", key: 'Notification' },
                { routeTo: ['setup-trxn'], icon:"fa fa-cc-visa", key: 'Bank' },
                { routeTo: ['bank-trxn'], icon:"fa fa-cc-visa", key: 'Bank Integration' }
            ]
        },
        {
            name: "Others", isFLatChildren: true,
            children:[
                { routeTo: ['integration'], icon:"fa fa-graduation-cap", key: 'Other Integration' },
                { routeTo: ['quiz'], icon:"fa fa-question-circle", key: 'Quiz' }
            ]
        }
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public cdref: ChangeDetectorRef){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}
