import { Component } from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, DynamicComponent} from "@app-global";
import {SoftwareInvoicePrintView} from "../components/software-invoice-print.view";
import {OrgSoftwareInvoiceReceipt} from "../domains/org-software-invoice.serializer";

@Component({
  template: '<button class="btn btn-xs theme text-theme b-theme" (click)="showMyDetails(context)">Invoice</button>'
})
export class SoftwareInvoiceCellComponent extends DynamicComponent{
  constructor(private sharedService: SharedService){ super(); }

    showMyDetails(row: OrgSoftwareInvoiceReceipt) {
      const { id, invoiceId, licenseId, voucherNo } = row;
        const inputData: any = {
            data: {
                invoiceId: invoiceId,
                licenseId: licenseId,
                voucherNo: voucherNo
            }
        };
        const popupHeaderOptions = {text: `${row.voucherNo}: ${ row.voucherDate }`, desc: '' };
        const onSuccess = (resp)=> {
            this.sharedService.destroy();
        };
        const onFailure = (resp)=> {
            this.sharedService.destroy();
        };

        const popupOptions = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        this.sharedService.showCustomPopup(SoftwareInvoicePrintView, popupOptions, inputData).then(onSuccess, onFailure);
    }
}
