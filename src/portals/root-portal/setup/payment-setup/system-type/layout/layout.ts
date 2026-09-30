import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentSystemTypeLookup} from "../../lookup.serializer";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {Subscription} from "rxjs";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class PaymentGatewayLayout implements OnInit {
    systemType: PaymentSystemTypeLookup;
    systemTypes: Array<PaymentSystemTypeLookup>;

    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'system', key: "Payment System", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'mode', key: "Payment Mode", sortOrder: 2 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}
    ngOnInit() {
        this.systemTypes = this.apiResolver.masterType.paymentSystemTypes;
        var systemType = this.apiResolver.masterType.getSystemTypeByName('cash');
        this.changeSystemRoute(systemType);
    }
    changeSystemRoute(sysType){
        this.systemType = sysType;
        this.router.navigate([sysType.code],{relativeTo: this.activatedRoute});
    }
    onActivate(componentRef){}
}

@Component({
    standalone: false,
    templateUrl: './templates/system-layout.html'
})
export class PaymentSystemLayout implements OnInit, OnDestroy {
    systemType: PaymentSystemTypeLookup;
    paramsSubscription: Subscription;
    // public navList: Array<any> = [
    //     { id:1, icon:"fa fa-dashboard", routeTo: 'system', key: "Payment System", sortOrder: 1 },
    //     { id:2, icon:"fa fa-dashboard", routeTo: 'mode', key: "Payment Mode", sortOrder: 2 },
    // ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params.subscribe((parms: { code: string }) =>
        {
            this.systemType = this.apiResolver.masterType.getSystemTypeByName(parms.code);
        });
    }
    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }

    onActivate(componentRef){}

    createNew() {
        const modes = this.apiResolver.masterType.getSystemTypeByName(this.systemType?.code);
        const data = {
            systemTypeId: this.systemType.id,
            // modeGatewayMapper: (modes || []).map(r => <any>{
            //     id: null,
            //     gatewayId: null,
            //     modeId: r.id,
            //     modeName: r.name,
            //     isReceiptAllowed: false,
            //     isPaymentAllowed: false,
            //     status: true,
            // })
        };
        const inputData: any = { id: null, data };
        const success = ()=> { };
        this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `new Gateway`, desc: '' }, success);
    }
}