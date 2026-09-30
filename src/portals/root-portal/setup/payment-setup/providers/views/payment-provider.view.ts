import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentProvider, PaymentProviderQueryOptions} from "../domains/payment-provider.serializer";
import {PaymentProviderService} from "../services/payment-provider.service";

@Component({
  standalone: false,
  templateUrl: './templates/payment-provider.html',
  styles: [`:host { display: contents; }`],
})
export class PaymentProviderView extends ViewExtender<PaymentProvider> implements OnInit, OnDestroy {
    override coreState: PaymentProviderQueryOptions = new PaymentProviderQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: PaymentProviderService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            //{headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Type', field: 'typeName' },
            {headerName: 'Website', field: 'website' },
            {headerName: 'Rails', field: 'railCount' },
            {headerName: 'Countries', field: 'countries' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }
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
