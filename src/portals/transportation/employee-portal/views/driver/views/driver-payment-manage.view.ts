import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {DateFormatCell, ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {DriverPayment, DriverPaymentQueryOptions} from "../domains/driver-payment.serializer";
import {DriverPaymentService} from "../services/driver.service";

@Component({
    templateUrl: './templates/payout-payment.html',
  standalone: false
})
export class DriverPaymentManageView extends ViewExtender<DriverPayment> implements OnInit, OnDestroy{
  override coreState: DriverPaymentQueryOptions  = new DriverPaymentQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: DriverPaymentService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'head', field: 'head' },
            {headerName: 'VoucherNo', field: 'voucherNo' },
            {headerName: 'Voucher Date', field: 'voucherDate', cellTemplate: DateFormatCell },
            {headerName: 'Amount', field: 'netAmount' },
            {headerName: 'Mode', field: 'trxnModeName' },
            {headerName: 'Remark', field: 'remark' }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: DriverPayment) {}
    createNew(){}
}
