import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, Routes} from "@angular/router";
import {Component, Injectable, Injector, OnInit} from "@angular/core";
import {PaymentSetupLookupAPIResolver} from "./api.resolver";

@Component({
    standalone: false,
    templateUrl: './payment-layout.html'
})
export class PaymentLayout implements OnInit {
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'providers', key: "Providers", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'systemType', key: "System Types", sortOrder: 2 },
        { id:3, icon:"fa fa-dashboard", routeTo: 'rails', key: "Rails", sortOrder: 3 }
    ];
    constructor(public router: Router, public activatedRoute: ActivatedRoute){}
    ngOnInit() {}
    onActivate(componentRef){}
}

export const PaymentGatewayRoutes: Routes = [
    {
      path: '', resolve: { items: PaymentSetupLookupAPIResolver }, component: PaymentLayout,
      children:[
          { path: '', pathMatch: 'full', redirectTo: 'providers' },
          { path: 'systemType', loadChildren: () => import('./system-type').then(m => m.PaymentSystemTypeModule) },
          { path: 'providers', loadChildren: () => import('./providers').then(m => m.PaymentProviderModule) },
          { path: 'rails', loadChildren: () => import('./rails').then(m => m.PaymentRailModule) },
      ]
    }
];

export const PAYMENT_GATEWAY_VIEWS = [PaymentLayout];
