import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { PaymentModeGatewayMapperService } from "../services/payment-gateway.service";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {PaymentModeLookup, PaymentSystemTypeLookup} from "../domains/lookup.serializer";
import {PaymentGatewayByMode, PaymentGatewayByModeQueryOptions} from "../domains/payment-gateway-by-mode.serializer";
import {PaymentModeGatewayCell, PaymentModeServiceChargesCell} from "../grid-cell/payment-gateway-mode-grid.cell";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
  standalone: false,
    templateUrl: './templates/payment-gateway-by-mode.html',
    styles: [`:host { display: contents; }`],
})
export class PaymentGatewayByModeView extends ViewExtender<PaymentGatewayByMode> implements OnInit, OnDestroy {
    override coreState: PaymentGatewayByModeQueryOptions = new PaymentGatewayByModeQueryOptions();
    modes: Array<PaymentModeLookup>;

    systemType: PaymentSystemTypeLookup;
    mode: PaymentModeLookup;
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: PaymentModeGatewayMapperService,
                public apiResolver: PaymentGatewayLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Gateway/ Reco Frequency', cellTemplate: PaymentModeGatewayCell },
            {headerName: 'Mode', field: 'modeName' },
            {headerName: 'ReceiptAllowed', field: 'isReceiptAllowed', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'PaymentAllowed', field: 'isPaymentAllowed', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Charges', field: 'isReconciliationRequired', cellTemplate: PaymentModeServiceChargesCell },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit()
    {
        const path = this.activatedRoute.snapshot.routeConfig.path;
        if(path == 'all'){
            this.systemType = this.apiResolver.allSystemType;
            this.coreState.systemTypeId = null;
            this.modes = this.apiResolver.masterType.getAllModes();
        } else {
            this.systemType = this.apiResolver.masterType.getSystemTypeByName(path);
            this.coreState.systemTypeId = this.systemType?.id;
            this.modes = this.apiResolver.masterType.getModesBySystemTypeId(this.systemType?.id);
        }
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
        const data = {
            systemTypeId: this.systemType.id,
            modeGatewayMapper: (this.modes || []).map(r => <any>{
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
        const success = ()=> { super.populateGrid(); };
        this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `new Gateway`, desc: '' }, success);
    }

    applyMode(row: PaymentModeLookup) {
        this.mode = row;
        this.coreState.modeId = this.mode.id;
        super.populateGrid();
    }
}
