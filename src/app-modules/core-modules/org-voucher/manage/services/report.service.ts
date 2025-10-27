import {Injectable, Injector} from "@angular/core";
import { CoreEndpointBase } from "@app-global";
import {catchError, tap} from "rxjs";

@Injectable()
export class FinanceVoucherService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }

    fetchAccountListByParticularName = (voucherMasterType: string, isCreditTrxn: boolean, name: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}voucherLookup/particular/account/${voucherMasterType}/${name}?isItemInvoice=false&isCreditTrxn=${isCreditTrxn}`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.fetchAccountListByParticularName(voucherMasterType, isCreditTrxn, name)))
        );

    fetchItemListByParticularName = (voucherMasterType: string, isCreditTrxn: boolean, name: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}voucherLookup/particular/product/${voucherMasterType}/${name}?isItemInvoice=true&isCreditTrxn=${isCreditTrxn}`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.fetchItemListByParticularName(voucherMasterType, isCreditTrxn, name)))
        );

    fetchPurchaseBillByProject = (vendorAccountId: string, projectId: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}invoice/purchase-bill/${vendorAccountId}/${projectId}`, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => console.log('read logged'),
                catchError(error => this.handleError(error, () => this.fetchPurchaseBillByProject(vendorAccountId, projectId)))
            )
        );

    getVoucherHtml(voucherMasterType: string, voucherId: number, voucherTypeId: number, key: string) {
        //const {name, taxId, websiteUrl, address, country, emailId1, contactNo1, emailId2, contactNo2} = orgBranch || {};
        const org = {};// { name, taxId, websiteUrl, address, country, emailId1, contactNo1, emailId2, contactNo2 };
        let req = `${this.baseSectorAPIUrl}invoice/html/${voucherMasterType}/${voucherId}/${voucherTypeId}`;
        if (key) {
            req = `${req}/${key}`;
        }
        return this.httpClient.post(req, org, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.getVoucherHtml(voucherMasterType, voucherId, voucherTypeId, key)))
            );
    }

    getVoucherPDF(voucherMasterType: string, voucherId: number, voucherTypeId: number) {
        const req = `${this.baseSectorAPIUrl}invoice/pdf/${voucherMasterType}/${voucherId}/${voucherTypeId}`;
        const orgBranch = {};
        return this.httpClient
            .post(req, orgBranch, this.getFileDownloadRequestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.getVoucherPDF(voucherMasterType, voucherId, voucherTypeId)))
            );
    }

    getPdfReportOptions = () => this.httpClient.get(`${this.baseSectorAPIUrl}invoice/report-options`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.getPdfReportOptions()))
        );
}

@Injectable()
export class ReportService extends CoreEndpointBase {
    constructor(public override injector: Injector) { super(injector); }
    // Others
    getReceiptsByProjectId = (projectId: string) => this.httpClient.get(`${this.baseAPIUrl}/list/${projectId}`, this.requestHeaders);

    createProduct = (data: any) => this.httpClient
        .post(`${this.baseSectorAPIUrl}ProductPrice`, data, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => console.log('read logged'),
                catchError(error => this.handleError(error, () => this.createProduct(data)))
            )
        );

    createAccount = (data: any) => this.httpClient
        .post(`${this.baseSectorAPIUrl}account`, data, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => console.log('read logged'),
                catchError(error => this.handleError(error, () => this.createAccount(data)))
            )
        );

    fetchAccountByName = (name: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}finance/accounts/${name}`, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => console.log('read logged')
            )
        );

    makePayment = (data) => this.httpClient.post(this.baseSectorAPIUrl + `/payment`, data, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => console.log('read logged'),
                catchError(error => this.handleError(error, () => this.makePayment(data)))
            )
        );
}
