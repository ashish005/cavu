import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {PaymentProviderLookup} from "../../lookup.serializer";
import {ProviderCountryService} from "../services/provider-country.service";
import {ProviderCountry, ProviderCountryQueryOptions} from "../domains/provider-country.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/payment-provider.html',
  styles: [`:host { display: contents; }`],
})
export class ProviderCountryView extends ViewExtender<ProviderCountry> implements OnInit, OnDestroy {
    provider: PaymentProviderLookup;
    override coreState: ProviderCountryQueryOptions = new ProviderCountryQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: ProviderCountryService, public apiResolver: PaymentSetupLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Enabled', field: 'isEnabled', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit()
    {
        this.paramsSubscription = this.activatedRoute.parent?.params
            .subscribe((parms: { code: string }) =>
        {
            var provider = this.apiResolver.masterType.getProviderByCode(parms.code);
            this.changeProvider(provider);
        });
    }

    changeProvider(provider: PaymentProviderLookup) {
        this.provider = provider;
        this.coreState.providerId = this.provider?.id;
        super.populateGrid();
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }
    actionCb(row: any){
        // const inputData: any = { id: row.id, data: row };
        // const success = ()=> {
        //     super.populateGrid();
        // };
        // this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `${row.gatewayName}`, desc: '' }, success);
    }
    createNew() {
        // const data = {
        //     systemTypeId: this.mode.systemTypeId,
        //     modeGatewayMapper: (this.modes || []).map(r => <any>{
        //         id: null,
        //         gatewayId: null,
        //         modeId: r.id,
        //         modeName: r.name,
        //         isReceiptAllowed: false,
        //         isPaymentAllowed: false,
        //         status: true,
        //     })
        // };
        // const inputData: any = { id: null, data };
        // const success = ()=> { super.populateGrid(); };
        // this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `new Gateway`, desc: '' }, success);
    }
}
