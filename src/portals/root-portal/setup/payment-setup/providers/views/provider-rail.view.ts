import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentProviderLookup} from "../../lookup.serializer";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {ProviderRail, ProviderRailQueryOptions} from "../domains/provider-rail.serializer";
import {ProviderRailService} from "../services/provider-rail.service";

@Component({
  standalone: false,
  templateUrl: './templates/payment-provider.html',
  styles: [`:host { display: contents; }`],
})
export class ProviderRailView extends ViewExtender<ProviderRail> implements OnInit, OnDestroy {
    provider: PaymentProviderLookup;
    override coreState: ProviderRailQueryOptions = new ProviderRailQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: ProviderRailService,
                public apiResolver: PaymentSetupLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Incoming', field: 'supportsIncoming', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Outgoing', field: 'supportsOutgoing', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Refund', field: 'supportsRefund', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Recurring', field: 'supportsRecurring', cellTemplate: GridUISwitchCellComponent },

            {headerName: 'Mandate', field: 'supportsMandate', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Effective From', field: 'effectiveFrom', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Effective To', field: 'effectiveTo', cellTemplate: GridUISwitchCellComponent },

            {headerName: 'Enabled', field: 'isEnabled', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit()
    {
        this.paramsSubscription = this.activatedRoute.parent.params
            .subscribe((parms: { code: string }) =>
        {
            var provider = this.apiResolver.masterType.getProviderByCode(parms.code);
            this.changeRail(provider);
        });
    }

    changeRail(provider: PaymentProviderLookup) {
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
