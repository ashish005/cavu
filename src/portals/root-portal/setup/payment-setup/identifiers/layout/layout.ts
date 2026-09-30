import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {IdentifierTypeLookup} from "../../lookup.serializer";
import {Subscription} from "rxjs";

@Component({
    standalone: false,
    templateUrl: './templates/layout.html'
})
export class BankIdentifierTypeLayout implements OnInit {
    identifierType: IdentifierTypeLookup;
    identifierTypes: IdentifierTypeLookup[];
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'system', key: "Payment System", sortOrder: 1 },
        { id:2, icon:"fa fa-dashboard", routeTo: 'mode', key: "Payment Mode", sortOrder: 2 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}
    ngOnInit() {
        this.identifierTypes = this.apiResolver.masterType.identifierTypes || [];
        this.changeSystemRoute(this.identifierTypes[0]);
    }
    changeSystemRoute(identifierType: IdentifierTypeLookup){
        this.identifierType = identifierType;
        this.router.navigate([identifierType.code],{relativeTo: this.activatedRoute});
    }
    onActivate(componentRef){}
}

@Component({
    standalone: false,
    templateUrl: './templates/sub-layout.html'
})
export class BankIdentifierTypeSubLayout implements OnInit, OnDestroy {
    identifierType: IdentifierTypeLookup;
    paramsSubscription: Subscription;
    public navList: Array<any> = [
        { id:1, icon:"fa fa-dashboard", routeTo: 'country', key: "Country", sortOrder: 1 },
        //{ id:3, icon:"fa fa-dashboard", routeTo: 'rail', key: "Rail", sortOrder: 3 },
    ];
    constructor(public router: Router,
                public activatedRoute: ActivatedRoute,
                public apiResolver: PaymentSetupLookupAPIResolver){}

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params.subscribe((parms: { code: string }) =>
        {
            this.identifierType = this.apiResolver.masterType.getIdentifierTypeByCode(parms.code);
        });
    }
    ngOnDestroy() {
        this.paramsSubscription?.unsubscribe();
    }

    onActivate(componentRef){}

    createNew() {
        const modes = this.apiResolver.masterType.getRailByCode(this.identifierType?.code);
        const data = {
            identifierTypeId: this.identifierType.id,
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