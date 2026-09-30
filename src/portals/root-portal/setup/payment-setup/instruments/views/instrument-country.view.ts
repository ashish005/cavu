import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentSetupLookupAPIResolver} from "../../api.resolver";
import {InstrumentCountry, InstrumentCountryQueryOptions} from "../domains/instrument-country.serializer";
import {InstrumentTypeLookup} from "../../lookup.serializer";
import {InstrumentCountryService} from "../services/instrument-country.service";

@Component({
  standalone: false,
  templateUrl: './templates/country.html',
  styles: [`:host { display: contents; }`],
})
export class InstrumentCountryView extends ViewExtender<InstrumentCountry> implements OnInit, OnDestroy {
    instrument: InstrumentTypeLookup;
    override coreState: InstrumentCountryQueryOptions = new InstrumentCountryQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: InstrumentCountryService, public apiResolver: PaymentSetupLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Payment Mode', field: 'paymentModeName' },
            {headerName: 'Required', field: 'isRequired', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Primary', field: 'isPrimary', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit()
    {
        this.paramsSubscription = this.activatedRoute.parent?.params
            .subscribe((parms: { code: string }) =>
        {
            var provider = this.apiResolver.masterType.getInstrumentByCode(parms.code);
            this.changeProvider(provider);
        });
    }

    changeProvider(instrument: InstrumentTypeLookup) {
        this.instrument = instrument;
        this.coreState.instrumentId = this.instrument?.id;
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
