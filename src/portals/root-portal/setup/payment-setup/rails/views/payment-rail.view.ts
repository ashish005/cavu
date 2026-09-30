import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentRail, PaymentRailQueryOptions} from "../domains/payment-rail.serializer";
import {PaymentRailService} from "../services/payment-rail.service";

@Component({
  standalone: false,
  templateUrl: './templates/payment-rail.html',
  styles: [`:host { display: contents; }`],
})
export class PaymentRailView extends ViewExtender<PaymentRail> implements OnInit, OnDestroy {
    override coreState: PaymentRailQueryOptions = new PaymentRailQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: PaymentRailService) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Type', field: 'typeName' },
            {headerName: 'Currencies', field: 'currencies' },
            {headerName: 'Countries', field: 'countries' },
            {headerName: 'PaymentModes', field: 'paymentModes' },
            {headerName: 'Providers', field: 'providers' },
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
