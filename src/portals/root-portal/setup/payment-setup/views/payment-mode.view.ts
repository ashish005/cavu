import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaymentSetupLookupAPIResolver} from "../services/api.resolver";
import {PaymentGatewayByMode} from "../domains/payment-gateway-by-mode.serializer";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentSystemTypeLookup} from "../domains/lookup.serializer";
import {PaymentModeService} from "../services/payment-mode.service";
import {PaymentModeQueryOptions} from "../domains/payment-mode.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/payment-mode.html',
  styles: [`:host { display: contents; }`],
})
export class PaymentModeView extends ViewExtender<PaymentGatewayByMode> implements OnInit, OnDestroy {
    override coreState: PaymentModeQueryOptions = new PaymentModeQueryOptions();
    systemType: PaymentSystemTypeLookup;
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: PaymentModeService,
                public apiResolver: PaymentSetupLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            //{headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Rails', field: 'paymentRailCount' },
            {headerName: 'Instruments', field: 'bankInstrumentCount' },
            //{headerName: 'Charges', field: 'isReconciliationRequired', cellTemplate: PaymentModeServiceChargesCell },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }
    ngOnInit()
    {
        this.activatedRoute.parent.params.subscribe((parms: { systemCode: string }) =>
        {
            var systemType = this.apiResolver.masterType.getSystemTypeByName(parms.systemCode);
            this.changeSystemRoute(systemType);
        });
    }

    changeSystemRoute(sysType){
        this.systemType = sysType;
        this.coreState.systemTypeId = this.systemType?.id;
        super.populateGrid();
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }
    actionCb(row: PaymentGatewayByMode){
        const inputData: any = { id: row.id, data: row };
        const success = ()=> {
            super.populateGrid();
        };
        this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `${row.gatewayName}`, desc: '' }, success);
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
