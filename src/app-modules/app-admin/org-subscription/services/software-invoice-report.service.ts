import { Injectable, Injector } from "@angular/core";
import {CoreEndpointBase} from "@app-global";
import {tap, catchError} from "rxjs";

@Injectable()
export class SoftwareInvoiceReportService extends CoreEndpointBase {
    public get softwareInvoiceUrl (){ return `${this.baseAPIUrl}softwareInvoice`; }

  constructor(public override injector: Injector) { super(injector);}

    getVoucherHtml(invoiceId: number, licenseId: number){
        let url = `${this.softwareInvoiceUrl}/html/${invoiceId}/${licenseId}`;
        return this.httpClient.get(url, this.requestHeaders)
            .pipe(
                catchError(error => { return this.handleError(error, () => this.getVoucherHtml(invoiceId, licenseId)); })
            );
    }

    getVoucherPDF(invoiceId: number, licenseId: number){
        const url = `${this.softwareInvoiceUrl}/pdf/${invoiceId}/${licenseId}`;
        const orgBranch = {};
        return this.httpClient
            .get(url, this.getFileDownloadRequestHeaders)
            .pipe(
                catchError(error => { return this.handleError(error, () => this.getVoucherPDF(invoiceId, licenseId)); })
            );
    }
}
