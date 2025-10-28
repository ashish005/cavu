import {Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
//import { saveAs } from 'file-saver';
import {SoftwareInvoiceReportService} from "../../services/software-invoice-report.service";

@Component({
    standalone: false,
    template: `<embed #pdf src="" WMODE="transparent" frameBorder="0" scrolling="auto" class="scrollable hover box-shadow p-3" height="100%" width="100%"/>`,
    selector: 'subscription-pdf-print',
    styles: [`:host {display: contents;}`],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class SubscriptionPdfPrintView
{
    @ViewChild('pdf', { static: true }) pdf: ElementRef;
    isLoading: boolean;

    constructor(public service: SoftwareInvoiceReportService, public renderer: Renderer2, public sanitizer: DomSanitizer){}

    showReport(invoiceId: number, licenseId: number)
    {
        this.isLoading = true;
        const failure = (resp) => { this.isLoading = false; };

        const pdfSuccess = (fileStream) => {
            this.isLoading = false;
            let blob = new Blob([fileStream], { type: fileStream.type });
            var fileSrc = URL.createObjectURL(blob);
            fileSrc += '#toolbar=0&navpanes=0&scrollbar=0';
            //const selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(fileSrc);
            this.renderer.removeAttribute(this.pdf.nativeElement, "src");
            setTimeout(() => { this.renderer.setAttribute(this.pdf.nativeElement, "src", fileSrc); }, 100);
        };
        this.service.getVoucherPDF(invoiceId, licenseId).toPromise().then(pdfSuccess, failure);
    }

    printPage() { window.print(); }

    downloadPdf(invoiceId: number, licenseId: number, invoiceNo: string) {
        this.isLoading = true;
        const failure = (resp) => { this.isLoading = false; };
        const pdfSuccess = (fileStream) => {
            this.isLoading = false;
            let blob = new Blob([fileStream], { type: fileStream.type });
            //saveAs(blob, `${invoiceNo}.pdf`);
        };
        this.service.getVoucherPDF(invoiceId, licenseId).toPromise().then(pdfSuccess, failure);
    }
}