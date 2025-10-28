import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
    OrgSoftwareInvoiceQueryOptions,
    OrgSoftwareInvoiceReceipt
} from "../domains/org-software-invoice.serializer";
import {OrgSoftwareInvoiceService} from "../services/software-invoice.service";
import {ViewExtender, FullDateFormatCell, NumberCell} from "@app-global";
import {SoftwareInvoiceCellComponent} from "../grid-action-cell/software-invoice-cell.component";

@Component({
    standalone: false,
  templateUrl: './templates/software-invoice.html'
})
export class SoftwareInvoiceView extends ViewExtender<OrgSoftwareInvoiceReceipt> implements OnInit {
    @ViewChild('orgLicenseGrid', { static: true }) orgLicenseGrid;
  override coreState: OrgSoftwareInvoiceQueryOptions = new OrgSoftwareInvoiceQueryOptions();
  constructor(public override service: OrgSoftwareInvoiceService,
                public router: Router,
                public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Invoice No', field: 'voucherNo' },
            {headerName: 'Invoice Date', field: 'voucherDate', cellTemplate: FullDateFormatCell },
            {headerName: 'Payment Mode', field: 'paymentMode' },
            {headerName: 'Payment Ref.', field: 'paymentReferenceNumber' },
            {headerName: 'Amount', field: 'amount', class: 'text-right', cellTemplate: NumberCell },
            {headerName: 'Action', cellTemplate: SoftwareInvoiceCellComponent },

        ];
    }

    ngOnInit(){
        super.populateGrid();
    }

   override ngOnDestroy()
    {
        super.ngOnDestroy();
    }
    actionCb(e){}
}
