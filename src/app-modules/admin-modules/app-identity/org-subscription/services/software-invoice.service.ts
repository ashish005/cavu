import { CoreResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {
    OrgSoftwareInvoiceReceipt, OrgSoftwareInvoiceReceiptSerializer
} from "../domains/org-software-invoice.serializer";
import {catchError} from "rxjs";

@Injectable()
export class OrgSoftwareInvoiceService extends CoreResourceService<OrgSoftwareInvoiceReceipt>{
    constructor(public override injector: Injector) { super(injector, 'softwareInvoice', new OrgSoftwareInvoiceReceiptSerializer()); }

    getVoucherHtml(invoiceId: number, licenseId: number){
        let url = `${this.viewUrl}/html/${invoiceId}/${licenseId}`;
        return this.httpClient.get(url, this.requestHeaders)
            .pipe(
                catchError(error => { return this.handleError(error, () => this.getVoucherHtml(invoiceId, licenseId)); })
            );
    }

    getVoucherPDF(invoiceId: number, licenseId: number){
        const url = `${this.viewUrl}/pdf/${invoiceId}/${licenseId}`;
        const orgBranch = {};
        return this.httpClient
            .get(url, this.getFileDownloadRequestHeaders)
            .pipe(
                catchError(error => { return this.handleError(error, () => this.getVoucherPDF(invoiceId, licenseId)); })
            );
    }
}
