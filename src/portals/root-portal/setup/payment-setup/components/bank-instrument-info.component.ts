import {
    Component,
    EventEmitter,
    Input, OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {PaymentGatewayLookupAPIResolver} from "../services/api.resolver";
import {PaymentMode, PaymentModeQueryOptions} from "../domains/payment-mode.serializer";
import {PaymentModeService} from "../services/payment-mode.service";
import {ActivatedRoute} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/bank-instrument-info.html',
    styles:[`:host { display: contents; }`]
})
export class BankInstrumentInfoComponent extends ViewExtender<PaymentMode> implements  OnInit, OnDestroy {
    override coreState: PaymentModeQueryOptions = new PaymentModeQueryOptions();
    submitted: boolean = false;
    @Input() isBank: boolean;
    @Input() systemTypeId: any;
    constructor(public override activatedRoute: ActivatedRoute,
                public apiResolver: PaymentGatewayLookupAPIResolver,
                public override service: PaymentModeService){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'description', field: 'description' },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){
        if(this.isBank) {
            this.gridOptions.columnDefs = [
                {headerName: 'Name', field: 'name' },
                {headerName: 'description', field: 'description' },
                {headerName: 'Instrument', field: 'instrumentName' },
                {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
            ];
        }
        this.coreState.systemTypeId = this.systemTypeId;
        super.populateGrid();
    }

    override ngOnDestroy(){super.ngOnDestroy();}
    actionCb(e){}
}
