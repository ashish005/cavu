import {
    Component,
    OnDestroy,
    OnInit
} from "@angular/core";
import {DateFormatCell, ViewExtender} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {BookingReceiptService} from "../services/tracker.service";
import {BookingReceipt, BookingReceiptQueryOptions} from "../domains/booking-receipt.serializer";

@Component({
    templateUrl: './templates/manage.html',
    providers: [BookingReceiptService],
  standalone: false
})
export class BookingRcptManageView extends ViewExtender<BookingReceipt> implements OnInit, OnDestroy {
  override coreState: BookingReceiptQueryOptions = new BookingReceiptQueryOptions();
    constructor(public router: Router, public override activatedRoute: ActivatedRoute, public override service: BookingReceiptService) {
        super(activatedRoute, service);
        this.gridOptions.header =  { title: '', desc: '', add: false, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Vehicle', field: 'vehicleName' },
            {headerName: 'VehicleNo', field: 'vehicleNo' },

            {headerName: 'Tracker No', field: 'trackerNo' },

            {headerName: 'Voucher No', field: 'voucherNo' },
            {headerName: 'Voucher Date', field: 'voucherDate' },
            {headerName: 'Party Name', field: 'partyName' },
            {headerName: 'Trxn Mode', field: 'trxnMode' },
            {headerName: 'Report Head', field: 'reportHeadName' },
            {headerName: 'Amount', field: 'netAmount' }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    override ngOnDestroy(){ super.ngOnDestroy(); }

    actionCb(row: BookingReceipt) {}
    createNew(){}
}
