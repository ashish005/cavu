import { GlobalModule } from "@app-global";
import {ChangeDetectorRef, Component, ModuleWithProviders, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";

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
    CommonModule,
    RouterModule.forChild([
        {
            path: '', component: Layout,
            data: {code: 'FIN'},
            children: [
                { path: '', pathMatch: 'full', redirectTo:'sale' },
                { path: 'inventory', loadChildren: () => import('./inventory-reports').then(m => m.InventoryReportModule), data: { title: 'Inventory Reports', header:'Inventory Reports'} },
                { path: 'sale', loadChildren: () => import('./sale-reports').then(m => m.SaleReportModule), data: { title: 'Sale Reports', header:'Sale Reports'} },
                { path: 'purchase', loadChildren: () => import('./purchase-reports').then(m => m.PurchaseReportModule), data: { title: 'Purchase Reports', header:'Purchase Reports'} },
                { path: 'payment', loadChildren: () => import('./payment-reports').then(m => m.PaymentReportModule), data: { title: 'Payment Reports', header:'Payment Reports'} },
                { path: 'receipt', loadChildren: () => import('./receipt-reports').then(m => m.ReceiptReportModule), data: { title: 'Receipt Reports', header:'Receipt Reports'} }
            ]
        }
    ]),
    GlobalModule
  ],
  providers: [],
  declarations: [Layout]
})

export class OrgReportModule {
    static forRoot(): ModuleWithProviders<OrgReportModule> {
        return { ngModule: OrgReportModule };
    }
    static forChild(): ModuleWithProviders<OrgReportModule> {
        return { ngModule:  OrgReportModule };
    }
}
