import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {
    PaymentGatewayCell,
    PaymentGatewayOptionsCell,
    PaymentModeCell,
    PaymentProviderGatewayAccountCell,
    PaymentRealizationGatewayAccountCell
} from "../grid-cell/payment-gateway-grid.cell";
import {PaymentGateway, PaymentGatewayQueryOptions} from "../domains/payment-gateway.serializer";
import {PaymentGatewayService} from "../services/payment-gateway.service";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {PaymentSystemTypeLookup} from "../domains/lookup.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/payment-gateway.html',
    styles: [`:host { display: contents; }`],
})
export class PaymentGatewayView extends ViewExtender<PaymentGateway> implements OnInit, OnDestroy {
    override coreState: PaymentGatewayQueryOptions = new PaymentGatewayQueryOptions();
    systemType: PaymentSystemTypeLookup;
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: PaymentGatewayService,
                public apiResolver: PaymentGatewayLookupAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Gateway', cellTemplate: PaymentGatewayCell},
            {headerName: 'Mode', cellTemplate: PaymentModeCell},
            {headerName: 'Provider Acc', field: 'providerAccountName', cellTemplate: PaymentProviderGatewayAccountCell},
            {headerName: 'Realization Acc', field: 'realizationAccountName', cellTemplate: PaymentRealizationGatewayAccountCell},
            {headerName: 'Reference No', field: 'referenceNo', cellTemplate: PaymentGatewayOptionsCell }
        ];
    }

    ngOnInit()
    {
        const path = this.activatedRoute.snapshot.routeConfig.path;
        if(path == 'all'){
            this.systemType = this.apiResolver.allSystemType;
            this.coreState.systemTypeId = null;
        } else {
            this.systemType = this.apiResolver.masterType.getSystemTypeByName(path);
            this.coreState.systemTypeId = this.systemType?.id;
        }
        super.populateGrid();
    }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: PaymentGateway){
        const inputData: any = { id: row.id, data: row };
        const success = ()=> {
            super.populateGrid();
        };
        this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `${row.name}`, desc: '' }, success);
    }

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
        const success = ()=> { super.populateGrid(); };
        this.apiResolver.showPaymentGatewayCEPopup(inputData, { text: `new Gateway`, desc: '' }, success);
    }
}
