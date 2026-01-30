import {Injectable, Injector} from "@angular/core";
import {catchError, tap} from "rxjs";
import { CoreEndpointBase } from "@app-global";

@Injectable()
export class FinanceVoucherService extends CoreEndpointBase {
    path: string = 'voucherLookup/particular';
    constructor(public override injector: Injector) { super(injector); }

    fetchAccountListByParticularName=(voucherMasterType: string, name: string, q) => this.httpClient
        .get(`${this.baseSectorAPIUrl}/${this.path}/account/${voucherMasterType}/${name}?${q.toQueryString()}`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.fetchAccountListByParticularName(voucherMasterType, name, q)))
        );

    /*fetchAccountListByParticularName = (voucherMasterType: string, isCreditTrxn: boolean, name: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}/${this.path}/account/${voucherMasterType}/${name}?isItemInvoice=false&isCreditTrxn=${isCreditTrxn}`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.fetchAccountListByParticularName(voucherMasterType, isCreditTrxn, name)))
        );*/

    fetchItemListByParticularName = (voucherMasterType: string, isCreditTrxn: boolean, name: string) => this.httpClient
        .get(`${this.baseSectorAPIUrl}/${this.path}/product/${voucherMasterType}/${name}?isItemInvoice=true&isCreditTrxn=${isCreditTrxn}`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.fetchItemListByParticularName(voucherMasterType, isCreditTrxn, name)))
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