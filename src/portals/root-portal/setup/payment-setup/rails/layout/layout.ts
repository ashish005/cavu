import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentRailLookup} from "../../lookup.serializer";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {Subscription} from "rxjs";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class RailLayout implements OnInit {
    rail: PaymentRailLookup;
    rails: Array<PaymentRailLookup>;
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'system', key: "Payment System", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'mode', key: "Payment Mode", sortOrder: 2 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}
    ngOnInit() {
        this.rails = this.apiResolver.masterType.paymentRails || [];
        this.changeSystemRoute(this.rails[0]);
    }
    changeSystemRoute(rail: PaymentRailLookup){
        this.rail = rail;
        this.router.navigate([rail.code],{relativeTo: this.activatedRoute});
    }
    onActivate(componentRef){}
}

@Component({
    standalone: false,
    templateUrl: './templates/sub-layout.html'
})
export class RailSubLayout implements OnInit {
    rail: PaymentRailLookup;
    paramsSubscription: Subscription;
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'country', key: "Country", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'currency', key: "Currency", sortOrder: 2 },
        { id:3, icon:"fa fa-dashboard", routeTo: 'mode', key: "Mode", sortOrder: 3 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params.subscribe((parms: { code: string }) =>
        {
            this.rail = this.apiResolver.masterType.getRailByCode(parms.code);
        });
    }

    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }
    onActivate(componentRef){}

    createNew() {
        const modes = this.apiResolver.masterType.getRailByCode(this.rail?.code);
        const data = {
            railId: this.rail.id,
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