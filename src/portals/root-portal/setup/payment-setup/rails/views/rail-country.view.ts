import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {RailCountryService} from "../services/rail-country.service";
import {RailCountry, RailCountryQueryOptions} from "../domains/rail-country.serializer";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {PaymentRailLookup} from "../../lookup.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/country-rail.html',
  styles: [`:host { display: contents; }`],
})
export class RailCountryView extends ViewExtender<RailCountry> implements OnInit, OnDestroy {
    rail: PaymentRailLookup;
    override coreState: RailCountryQueryOptions = new RailCountryQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: RailCountryService,
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
            {headerName: 'EffectiveFrom', field: 'effectiveFrom' },
            {headerName: 'EffectiveTo', field: 'effectiveTo' },
            {headerName: 'Enabled', field: 'isEnabled', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit()
    {
        this.paramsSubscription = this.activatedRoute.parent?.params
            .subscribe((parms: { code: string }) =>
        {
            var rail = this.apiResolver.masterType.getRailByCode(parms.code);
            this.changeRail(rail);
        });
    }

    changeRail(rail: PaymentRailLookup) {
        this.rail = rail;
        this.coreState.railId = this.rail?.id;
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
