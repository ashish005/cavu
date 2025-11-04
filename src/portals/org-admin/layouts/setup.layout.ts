import {ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    templateUrl: './templates/setup.html',
  //styles: [`::ng-deep ng-component{ display: contents;}`],
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
                { routeTo: ['login-setup'], icon:"fa fa-user-circle", key: 'Login Setup' },
                { routeTo: ['module-access-setup'], icon:"fa fa-user-circle", key: 'Module Access Setup' }
            ]
        },
        {
            isFLatChildren: true, key: 'Teams, Workflow & Logs',
            children:[
                { routeTo: ['org-team'], icon:"fa fa-building", key: 'Team' },
                { routeTo: ['notification'], icon:"fa fa-bell", key: 'Notification' },
                { routeTo: ['org-log'], icon:"fa fa-clock-o", key: 'Error Logs' },
                { routeTo: ['process'], icon:"fa fa-history", key: 'Process & Workflow' },
                { routeTo: ['setup-trxn'], icon:"fa fa-cc-visa", key: 'Bank' },
                { routeTo: ['bank-trxn'], icon:"fa fa-cc-visa", key: 'Bank Integration' }
            ]
        },
        {
            isFLatChildren: true, key: 'Regulations Tracker',
            children:[
                { routeTo: ['tax-management'], icon:"fa fa-money", key: 'Tax management' },
                { routeTo: ['compliance'], icon:"fa fa-check-square-o", key: 'Compliance' },
                { routeTo: ['payroll'], icon:"fa fa-check-square-o", key: 'Payroll' }
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
                public cdref: ChangeDetectorRef){
    }
    ngAfterContentChecked() { this.cdref.detectChanges(); }
    onActivate(componentRef) {}
}
