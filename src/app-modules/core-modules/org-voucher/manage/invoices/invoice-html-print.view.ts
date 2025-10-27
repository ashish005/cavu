import {Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation} from "@angular/core";
import {FinanceVoucherService} from "../services/report.service";
import {DomSanitizer} from "@angular/platform-browser";
import { saveAs } from 'file-saver';

@Component({
    template: `<div #docContent [innerHTML]="innerHTML"></div>`,
    selector: 'invoice-html-print',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class InvoiceHtmlPrintView
{
    isLoading: boolean;
    innerHTML: any;
    @ViewChild('docContent', { static: true }) docContent: ElementRef;

    constructor(public service: FinanceVoucherService, public renderer: Renderer2, public sanitizer: DomSanitizer){}

    populateReportByKey(key: string, voucherId: number, voucherTypeId: number, voucherMasterType: string)
    {
        this.isLoading = true;
        const failure = (resp) => { this.isLoading = false; };

        const htmlSuccess = (resp) => {
            this.isLoading = false;
            this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(resp.content);
        };
        this.service.getVoucherHtml(voucherMasterType, voucherId, voucherTypeId, key).toPromise().then(htmlSuccess, failure);
        /*const success = () => {
            this.service.getVoucherHtml(voucherMasterType, voucherId, voucherTypeId, key).toPromise().then(htmlSuccess, failure)
        };
        this.service.getVoucherLookups().then(success);*/
    }

    printPage() { window.print(); }

    downloadPdf(voucherNo: string, voucherId: number, voucherTypeId: number, voucherMasterType: string) {
        this.isLoading = true;
        const failure = (resp) => { this.isLoading = false; };
        const pdfSuccess = (fileStream) => {
            this.isLoading = false;
            let blob = new Blob([fileStream], { type: fileStream.type });
            saveAs(blob, voucherNo+".pdf");
        };
        this.service.getVoucherPDF(voucherMasterType, voucherId, voucherTypeId).toPromise().then(pdfSuccess, failure);
        /*const success = () => {
            this.service.getVoucherPDF(voucherMasterType, voucherId, voucherTypeId).toPromise().then(pdfSuccess, failure)
        };
        this.service.getVoucherLookups().then(success);*/
    }
}