import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {DateFormatCell, ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {ContractorPayment, ContractorPaymentQueryOptions} from "../domains/contractor-payment.serializer";
import {ContractorPaymentService} from "../services/contractor.service";

@Component({
    templateUrl: './templates/payment.html',
    standalone: false
})
export class ContractorPaymentManageView extends ViewExtender<ContractorPayment> implements OnInit, OnDestroy{
  override coreState: ContractorPaymentQueryOptions = new ContractorPaymentQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: ContractorPaymentService) {
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

    actionCb(row: ContractorPayment) {}
    createNew(){}
}
