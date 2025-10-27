import {Component, ElementRef, ViewChild, ViewEncapsulation} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import { saveAs } from 'file-saver';
import {SoftwareInvoiceReportService} from "../../services/software-invoice-report.service";

@Component({
    template: `<div [innerHTML]="innerHTML"></div>`,
    selector: 'subscription-html-print',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class SubscriptionHtmlPrintView
{
    isLoading: boolean;
    innerHTML: any;
    //@ViewChild('docContent', { static: true }) docContent: ElementRef;

    constructor(public service: SoftwareInvoiceReportService, public sanitizer: DomSanitizer){}

    showReport(invoiceId: number, licenseId: number) {
        this.isLoading = true;
        const failure = (resp) => { this.isLoading = false; };

        const htmlSuccess = (resp) => {
            this.isLoading = false;
            this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(resp.content);
        };
        this.service.getVoucherHtml(invoiceId, licenseId).toPromise().then(htmlSuccess, failure);
    }

    printPage() { window.print(); }

    downloadPdf(invoiceId: number, licenseId: number, voucherNo: string) {
        this.isLoading = true;
        const failure = (resp) => { this.isLoading = false; };
        const pdfSuccess = (fileStream) => {
            this.isLoading = false;
            let blob = new Blob([fileStream], { type: fileStream.type });
            saveAs(blob, `${voucherNo}.pdf`);
        };
        this.service.getVoucherPDF(invoiceId, licenseId).toPromise().then(pdfSuccess, failure);
    }
}