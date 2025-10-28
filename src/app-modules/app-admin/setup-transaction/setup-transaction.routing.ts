import {ActivatedRoute, Router, Routes} from "@angular/router";
//import {ModuleGuard, PortalAuthGuard} from "@app-global";
import {Component, Injector} from "@angular/core";

@Component({
    standalone: false,
    templateUrl: './layout.html'
})
export class TransactionSetupLayout {
    public navList: Array<any>;
    constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute){
        const { translatePath } = this.activatedRoute.snapshot.data;
        this.navList = [
            {
                key: `${translatePath}.bank`, isFLatChildren: true,
                children:[
                    { id:1, icon:"fa fa-university", routeTo: ['bank-setup', 'bank'], key: `${translatePath}.bank_acc.nav_name`, sortOrder: 1 }
                ]
            },
            {
                key: `Bank config`, isFLatChildren: true,
                children:[
                    { id:2, icon:"fa fa-university", routeTo: ['bank-setup', 'config', 'card'], key: `Card`, sortOrder: 1 },
                    { id:2, icon:"fa fa-university", routeTo: ['bank-setup', 'config', 'payment-Type'], key: `Payment Types`, sortOrder: 1 }
                ]
            },
            {
                key: `Voucher`, isFLatChildren: true,
                children:[
                    { id:3, icon:"fa fa-university", routeTo: 'voucher-setup', key: `Voucher`, sortOrder: 3 }
                ]
            },
            {
                key: `${translatePath}.bank`, isFLatChildren: true,
                children:[
                    { id:5, icon:"fa fa-dashboard", routeTo: 'payment-gateway', key: `Gateway Setup`, sortOrder: 4 }
                ]
            }
        ];
    }
    onActivate(componentRef){}
}

export const SetupTransactionRoutes: Routes = [
    {
        path: '', component: TransactionSetupLayout, data: { translatePath: 'trxn_setup' },
        children: [
            {
                path: 'bank-setup', //canLoad:[ModuleGuard],
                loadChildren: () => import('app-modules/app-admin/setup-transaction/bank-setup').then(m => m.BankingModule),
                data: {title: 'Bank', header:'Bank', name: "Banking", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
            },
            {
                path: 'voucher-setup', //canLoad:[ModuleGuard],
                loadChildren: () => import('app-modules/app-admin/setup-transaction/voucher-setup').then(m => m.VoucherSetupModule),
                data: {title: 'Bank', header:'Bank', name: "Banking", key: 'layout.banking' }//code: "ACCESS_VT_MGT",
            },
            {
                path: 'payment-gateway', //canLoad:[PortalAuthGuard],
                loadChildren: () => import('app-modules/app-admin/setup-transaction/payment-gateway/index').then(m => m.PaymenyGatewayModule),
                data: { code: "ACCESS_TAX_MGT", title: 'Paymeny Gateway', header:'Paymeny Gateway'}
            }
        ]
    }
];
