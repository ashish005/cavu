import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {PaymentSystemTypeLookup} from "../domains/lookup.serializer";

@Component({ templateUrl: './layout.html' })
export class PaymentGatewayLayout implements OnInit {
    systemType: PaymentSystemTypeLookup;
    menuItems: Array<any> = [
        { name: 'List', sortOrder: 2, route: 'list', icon: 'fa-list'},
        { name: 'Mode', sortOrder: 3, route: 'mode', icon: 'fa-table'}
    ];
    canCreateNewGateway: boolean;
    allSystemType: PaymentSystemTypeLookup;
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public apiResolver: PaymentGatewayLookupAPIResolver){
        this.allSystemType = apiResolver.allSystemType;
    }

    changeRouteTo(item){
        this.router.navigate([item?.route, this.systemType.masterType], {relativeTo: this.activatedRoute.parent});
    }

    changeSystemRoute(item){
        this.systemType = item;
        this.router.navigate([item?.masterType || 'all'], {relativeTo: this.activatedRoute});
    }

    ngOnInit() {}

    onActivate(componentRef){
        const path = componentRef.activatedRoute.snapshot.routeConfig.path;
        if(path == 'all'){
            this.systemType = this.apiResolver.allSystemType;
            this.canCreateNewGateway = false;
        } else {
            this.systemType = this.apiResolver.masterType.getSystemTypeByName(path);
            this.canCreateNewGateway = !['voucher', 'cash'].some(r => r == this.systemType?.masterType);
        }
    }

    showPaymentModes() {
        const inputData: any = { isBank: this.systemType.isBank(), systemTypeId: this.systemType.id };
        const success = ()=> {};
        this.apiResolver.showBankInstruments(inputData, { text: `${this.systemType?.name}`, desc: '' }, success);
    }
}