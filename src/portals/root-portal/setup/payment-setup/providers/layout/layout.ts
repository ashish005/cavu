import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {PaymentProviderLookup} from "../../lookup.serializer";
import {Subscription} from "rxjs";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class ProviderLayout implements OnInit {
    provider: PaymentProviderLookup;
    providers: Array<PaymentProviderLookup>;
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'system', key: "Payment System", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'mode', key: "Payment Mode", sortOrder: 2 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}
    ngOnInit() {
        this.providers = this.apiResolver.masterType.paymentProviders || [];
        this.changeSystemRoute(this.providers[0]);
    }
    changeSystemRoute(provider: PaymentProviderLookup){
        this.provider = provider;
        this.router.navigate([provider?.code],{relativeTo: this.activatedRoute});
    }
    onActivate(componentRef){}
}

@Component({
    standalone: false,
    templateUrl: './templates/sub-layout.html'
})
export class ProviderSubLayout implements OnInit, OnDestroy {
    provider: PaymentProviderLookup;
    paramsSubscription: Subscription;
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'country', key: "Country", sortOrder: 1 },
        { id:3, icon:"fa fa-dashboard", routeTo: 'rail', key: "Rail", sortOrder: 3 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params.subscribe((parms: { code: string }) =>
        {
            this.provider = this.apiResolver.masterType.getProviderByCode(parms.code);
        });
    }
    ngOnDestroy() {
        this.paramsSubscription?.unsubscribe();
    }

    onActivate(componentRef){}

    createNew() {
        const modes = this.apiResolver.masterType.getRailByCode(this.provider?.code);
        const data = {
            providerId: this.provider.id,
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