import {ActivatedRoute, Router, Routes} from "@angular/router";
//import {ModuleGuard, PortalAuthGuard} from "@app-global";
import {ChangeDetectorRef, Component, Injector, TemplateRef} from "@angular/core";

@Component({
    standalone: false,
    templateUrl: './layout.html'
})
export class TransactionSetupLayout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
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
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}

export const SetupTransactionRoutes: Routes = [
    {
        path: '', component: TransactionSetupLayout, data: { translatePath: 'trxn_setup' },
        children: [
            {
                path: 'bank-setup', //canLoad:[ModuleGuard],
                loadChildren: () => import('./bank-setup').then(m => m.BankingModule),
                data: {title: 'Bank', header:'Bank', name: "Banking", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
            },
            {
                path: 'voucher-setup', //canLoad:[ModuleGuard],
                loadChildren: () => import('./voucher-setup').then(m => m.VoucherSetupModule),
                data: {title: 'Bank', header:'Bank', name: "Banking", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
            },
            {
                path: 'payment-gateway', //canLoad:[PortalAuthGuard],
                loadChildren: () => import('./payment-gateway').then(m => m.PaymenyGatewayModule),
                data: { code: "ACCESS_TAX_MGT", title: 'Paymeny Gateway', header:'Paymeny Gateway'}
            },
            {
                path: 'bank-trxn', //canLoad:[ModuleGuard],
                loadChildren: () => import('./transaction').then(m => m.BankTransactionModule),
                data: {title: 'Trxn', header: 'Bank Trxn', name: "Bank Trxn", key: 'layout.banking'}//code: "ACCESS_VT_MGT",
            },
        ]
    }
];
