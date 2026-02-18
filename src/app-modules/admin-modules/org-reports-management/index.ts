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
            isFLatChildren: false, key: 'Reports',
            children:[
                { routeTo: ['sale'], icon:"fa fa-group", code: "", key: 'Sale Report' },
                { routeTo: ['purchase'], icon:"fa fa-bell", code: "", key: 'Purchase Report' },//code: "COM"
                { routeTo: ['payment'], icon:"fa fa-bell", code: "", key: 'Payment Report' },//code: "COM"
                { routeTo: ['receipt'], icon:"fa fa-bell", code: "", key: 'Receipt Report' },//code: "COM"
                { routeTo: ['inventory'], icon:"fa fa-dashboard", key: "Inventory Report" }
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
