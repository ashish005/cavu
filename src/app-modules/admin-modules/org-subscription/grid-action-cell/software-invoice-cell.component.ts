import {Component} from "@angular/core";
import {DynamicComponent, SharedService} from "@app-global";
import {SoftwareInvoiceRow} from "../domains/grid-row.serializers";
import {openInvoicePopup} from "../components/software-invoice-print.view";

@Component({
    standalone: true,
    template: '<button type="button" class="btn btn-xs theme text-theme b-theme" (click)="open(context)">View</button>'
})
export class SoftwareInvoiceCellComponent extends DynamicComponent {
    constructor(private sharedService: SharedService) { super(); }

    open(row: SoftwareInvoiceRow) {
        openInvoicePopup(this.sharedService, row.id, row.voucherNo);
    }
}
