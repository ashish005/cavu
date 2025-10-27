import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {CurrencyCell, DateFormatCell, ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {VehiclePayout, VehiclePayoutQueryOptions} from "../domains/vehicle-payout.serializer";
import {VehiclePayoutService} from "../services/vehicle.service";
import {PaymentCellComponent, PayslipCellComponent} from "../grid-cells/vehicle-grid-cell.component";

@Component({
    templateUrl: './templates/payout.html',
  standalone: false
})
export class VehiclePayoutManageView extends ViewExtender<VehiclePayout> implements OnInit, OnDestroy{
  override coreState: VehiclePayoutQueryOptions = new VehiclePayoutQueryOptions();
  constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: VehiclePayoutService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Vehicle No', field: 'vehicleNo' },
            {headerName: 'Month', field: 'month' },
            {headerName: 'Year', field: 'year' },
            {headerName: 'Due Date', field: 'dueDate', cellTemplate: DateFormatCell },

            {headerName: 'Due', field: 'dueAmount', class:'text-right', cellTemplate: CurrencyCell },
            {headerName: 'Other Payable', field: 'otherPayble', class:'text-right', cellTemplate: CurrencyCell },
            {headerName: 'Other Deduction', field: 'otherDeduction', class:'text-right', cellTemplate: CurrencyCell },

            {headerName: 'Payslip', cellTemplate: PayslipCellComponent },
            {headerName: 'Status', cellTemplate: PaymentCellComponent },
            {headerName: 'Paid', field: 'paidAmount', class:'text-right', cellTemplate: CurrencyCell },

            //{headerName: 'Payment', field: 'paymentStatus' },
            {headerName: 'Paid Date', field: 'paidDate' }
        ];
    }

    ngOnInit(){
        super.populateGrid();
        this.service.refresh$.subscribe(r => { super.populateGrid(); });
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: VehiclePayout) {}
    createNew(){}
}
