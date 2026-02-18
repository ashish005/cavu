import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {PaymentSystemType, PaymentSystemTypeQueryOptions} from "../domains/payment-type.serializer";
import {PaymentSystemTypeService} from "../services/payment-type.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {PaymentGatewayCellComponent, PaymentModeCellComponent} from "../grid-cell/payment-type-grid.cell";

@Component({
  standalone: false,
    templateUrl: './templates/card-type.html'
})
export class PaymentSystemTypeView extends ViewExtender<PaymentSystemType> implements OnInit{
  override coreState: PaymentSystemTypeQueryOptions = new PaymentSystemTypeQueryOptions();
    constructor(public override service: PaymentSystemTypeService,
                public override activatedRoute: ActivatedRoute,){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Mode', cellTemplate: PaymentModeCellComponent },
            {headerName: 'Gateway', cellTemplate: PaymentGatewayCellComponent },
            {headerName: 'POS', field: 'isPOS', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Wallet', field: 'isMobileWallet', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'API', field: 'isAPI', cellTemplate: GridUISwitchCellComponent }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(e){}
}
