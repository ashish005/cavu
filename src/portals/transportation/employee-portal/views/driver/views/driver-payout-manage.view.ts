import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {CurrencyCell, DateFormatCell, ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {DriverPayout, DriverPayoutQueryOptions} from "../domains/driver-payout.serializer";
import {DriverPayoutService} from "../services/driver.service";
import {PayslipCellComponent, VehiclePaymentCellComponent} from "../grid-cells/payout-grid-cell.component";

@Component({
    templateUrl: './templates/payout-payment.html',
  standalone: false
})
export class DriverPayoutManageView extends ViewExtender<DriverPayout> implements OnInit, OnDestroy{
  override coreState: DriverPayoutQueryOptions = new DriverPayoutQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: DriverPayoutService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Driver', field: 'driverName' },
            {headerName: 'Month/Year', field: 'monthYear' },
            {headerName: 'Due Amount', field: 'dueAmount', class:'text-right', cellTemplate: CurrencyCell },
            //{headerName: 'Paid', field: 'paidAmount', class:'text-right', cellTemplate: CurrencyCell },
            {headerName: 'Balance', field: 'balance', class:'text-right', cellTemplate: CurrencyCell },
            {headerName: 'Due Date', field: 'dueDate', cellTemplate: DateFormatCell },

            {headerName: 'Payslip', cellTemplate: PayslipCellComponent },
            {headerName: 'Status', cellTemplate: VehiclePaymentCellComponent },

            {headerName: 'Paid Date', field: 'paidDate', cellTemplate: DateFormatCell }
        ];
    }

    ngOnInit(){
        super.populateGrid();
        this.service.refresh$.subscribe(r => { super.populateGrid(); });
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: DriverPayout) {}
    createNew(){}
}
