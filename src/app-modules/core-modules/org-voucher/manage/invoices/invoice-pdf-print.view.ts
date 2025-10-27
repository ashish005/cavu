import {Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation} from "@angular/core";
import {FinanceVoucherService} from "../services/report.service";
import {DomSanitizer} from "@angular/platform-browser";
import { saveAs } from 'file-saver';

@Component({
    template: `<embed #pdf src="" WMODE="transparent" frameBorder="0" scrolling="auto" class="scrollable hover box-shadow p-3" height="100%" width="100%"/>`,
    selector: 'invoice-pdf-print',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class InvoicePdfPrintView
{
    @ViewChild('pdf', { static: true }) pdf: ElementRef;
    isLoading: boolean;

    constructor(public service: FinanceVoucherService, public renderer: Renderer2, public sanitizer: DomSanitizer){}

    populateReportByKey(key: string, voucherId: number, voucherTypeId: number, voucherMasterType: string)
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
        this.service.getVoucherPDF(voucherMasterType, voucherId, voucherTypeId).toPromise().then(pdfSuccess, failure);
        /*const success = () => {
            this.service.getVoucherPDF(voucherMasterType, voucherId, voucherTypeId).toPromise().then(pdfSuccess, failure)
        };
        this.service.getVoucherLookups().then(success);*/
    }

    printPage() { window.print(); }
}