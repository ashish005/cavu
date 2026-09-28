import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentSystemTypeLookup} from "../domains/lookup.serializer";
import {PaymentSetupLookupAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    templateUrl: './layout.html'
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
    templateUrl: './system-layout.html'
})
export class PaymentSystemLayout implements OnInit {
    systemType: PaymentSystemTypeLookup;
    // public navList: Array<any> = [
    //     { id:1, icon:"fa fa-dashboard", routeTo: 'system', key: "Payment System", sortOrder: 1 },
    //     { id:2, icon:"fa fa-dashboard", routeTo: 'mode', key: "Payment Mode", sortOrder: 2 },
    // ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}

    ngOnInit() {
        this.activatedRoute.params.subscribe((parms: { systemCode: string }) =>
        {
            this.systemType = this.apiResolver.masterType.getSystemTypeByName(parms.systemCode);
        });
    }
    onActivate(componentRef){}

    createNew() {
        const modes = this.apiResolver.masterType.getModesBySystemTypeId(this.systemType?.id);
        const data = {
            systemTypeId: this.systemType.id,
            modeGatewayMapper: (modes || []).map(r => <any>{
                id: null,
                gatewayId: null,
                modeId: r.id,
                modeName: r.name,
                isReceiptAllowed: false,
                isPaymentAllowed: false,
                status: true,
            })
        };
        const inputData: any = { id: null, data };
        const success = ()=> { };
        this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `new Gateway`, desc: '' }, success);
    }
}