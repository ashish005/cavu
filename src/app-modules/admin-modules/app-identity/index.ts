import {ChangeDetectorRef, Component, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`],
})
class Layout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'main',
            children:[
                { routeTo: ['org-setup'], icon:"fa fa-institution", key: 'Org setup' },
                { routeTo: ['role-permission-setup/role-module'], icon:"fa fa-envelope", key: 'Role & Permissions' }
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
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: Layout,
                data: {code: 'FIN', title: 'Accounting', header: 'Finance'},
                children: [
                    {path: '', pathMatch: 'full', redirectTo: 'org-setup'},
                    {
                        path: 'org-setup',
                        loadChildren: () => import('./org-setup/index').then(m => m.OrgSetupModule),
                        data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
                    },
                    {
                        path: 'role-permission-setup',
                        loadChildren: () => import('./module-permission/index').then(m => m.ManageUserModule),
                        data: {key: 'list', icon: "fa fa-money", name: "Money", title: 'Team', header: 'Team'}
                    },
                    {
                        path: 'module-access-setup',
                        loadChildren: () => import('./access-setup/contact-access/index').then(m => m.ContactAccessSetupModule)
                    },// data: { userType: ORG_USER_TYPE.EMPLOYEE } },
                    {
                        path: 'org-team',
                        loadChildren: () => import('./team-setup/manage/index').then(m => m.TeamSetupModule),
                        data: {icon: "fa fa-money", name: "Money", key: 'layout.team', title: 'Team', header: 'Team'}//code: "TEAM",
                    },
                    {
                        path: 'notification', //canLoad: [PortalAuthGuard],
                        loadChildren: () => import('app-modules/app-admin/notification/index').then(m => m.NotificationModule),
                        data: {
                            icon: "fa fa-envelope-open",
                            code: "ACCESS_NOTIFY_MGT",
                            title: 'Access Setup',
                            header: 'Access Setup',
                            name: "Notification",
                            key: 'layout.notification'
                        }
                    },
                    {
                        path: 'tax-management', //canLoad: [PortalAuthGuard],
                        loadChildren: () => import('app-modules/app-admin/tax-management/index').then(m => m.TaxManagementModule),
                        data: {code: "ACCESS_TAX_MGT", title: 'Tax', header: 'Manage Tax'}
                    },
                    {
                        path: 'setup-trxn',
                        loadChildren: () => import('app-modules/app-admin/setup-transaction/index').then(m => m.SetupTransactionModule),
                        data: {title: 'Bank', header: 'Bank', name: "Banking", key: 'layout.banking'}//code: "ACCESS_VT_MGT",
                    },
                    {
                        path: 'integration',
                        loadChildren: () => import('app-modules/app-admin/integration/index').then(m => m.IntegrationModule),
                        data: {title: 'Integration', header: 'Integration'}//code: '',
                    },
                    {
                        path: 'quiz',
                        loadChildren: () => import('app-modules/app-admin/quiz/index').then(r => r.QuizModule),
                        data: {title: 'Quiz', header: 'Quiz'}
                    },
                    {
                        path: 'transaction-setup',
                        loadChildren: () => import('app-modules/app-admin/setup-transaction/index').then(m => m.SetupTransactionModule),
                        data: {code: "ACCESS_ORG_MGR", title: 'Organization', header: 'Organization'}
                    },
                    {
                        path: 'bank-trxn', //canLoad:[ModuleGuard],
                        loadChildren: () => import('app-modules/app-admin/setup-transaction/transaction').then(m => m.BankTransactionModule),
                        data: {title: 'Trxn', header: 'Bank Trxn', name: "Bank Trxn", key: 'layout.banking'}//code: "ACCESS_VT_MGT",
                    },
                    {
                        path: 'payroll', //canLoad:[ModuleGuard],
                        loadChildren: () => import('app-modules/app-admin/salary').then(m => m.SalaryModule),
                        data: {title: 'Trxn', header: 'Payroll', name: "Payroll", key: 'Payroll'}//code: "ACCESS_VT_MGT",
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    declarations: [Layout]
})

export class OrgIdentitySetupModule {
}