import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CoreQueryOptions, FullDateFormatCell, InvoiceCurrencyCell, ViewExtender} from "@app-global";
import {SoftwareInvoiceRow} from "../domains/grid-row.serializers";
import {SoftwareInvoiceService} from "../services";
import {SoftwareInvoiceCellComponent} from "../grid-action-cell/software-invoice-cell.component";

@Component({
    standalone: false,
    templateUrl: './templates/grid-page.html'
})
export class SoftwareInvoiceView extends ViewExtender<SoftwareInvoiceRow> implements OnInit {
    override coreState = new CoreQueryOptions();

    constructor(public override service: SoftwareInvoiceService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.header = {...this.gridOptions.header, add: false, edit: false, delete: false};
        this.gridOptions.columnDefs = [
            {headerName: 'Invoice No', field: 'voucherNo'},
            {headerName: 'Invoice Date', field: 'voucherDate', cellTemplate: FullDateFormatCell},
            {headerName: 'Plan', field: 'planName'},
            {headerName: 'Payment Mode', field: 'paymentModeLabel'},
            {headerName: 'Payment Ref.', field: 'paymentReferenceNumber'},
            {headerName: 'Amount', field: 'netAmount', currencyCodeField: 'currencyCode', class: 'text-right', cellTemplate: InvoiceCurrencyCell},
            {headerName: 'Action', cellTemplate: SoftwareInvoiceCellComponent}
        ];
    }

    ngOnInit() { this.populateGrid(); }

    actionCb(_: any) {}
}
