import {Injectable, Injector} from "@angular/core";
import { catchError, tap, BehaviorSubject, Observable } from "rxjs";
import {FinanceVoucher, FinanceVoucherSerializer} from "../domains/finance-voucher.serializer";
import { OrgResourceService } from "@app-global";

@Injectable()
export class VoucherService extends OrgResourceService<FinanceVoucher> {
    voucher: FinanceVoucher;

    private $syncVoucher: BehaviorSubject<FinanceVoucher> = new BehaviorSubject<FinanceVoucher>(null);
    syncVoucher(data: any) { this.$syncVoucher.next(data); }
    syncVoucherListener(): Observable<any> { return this.$syncVoucher.asObservable(); }

    constructor(public override injector: Injector) { super(injector, 'voucher', new FinanceVoucherSerializer()); }

    getVoucherDetails = (voucherMasterType: string, voucherId: number) => this.httpClient
        .get(`${this.viewUrl}/${voucherMasterType}/${voucherId}`, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => {
                    this.voucher = new FinanceVoucher(resp.data);
                    this.syncVoucher(this.voucher);
                },
                catchError(error => this.handleError(error, () => this.getVoucherDetails(voucherMasterType, voucherId)))
            )
        );

    fetchPurchaseBillByProject = (vendorAccountId: string, projectId: string) => this.httpClient
        .get(`${this.viewUrl}/purchase-bill/${vendorAccountId}/${projectId}`, this.requestHeaders)
        .pipe(
            tap(
                (resp: any) => console.log('read logged'),
                catchError(error => this.handleError(error, () => this.fetchPurchaseBillByProject(vendorAccountId, projectId)))
            )
        );

    getVoucherHtml(voucherMasterType: string, voucherId: number, key: string) {
        //const {name, taxId, websiteUrl, address, country, emailId1, contactNo1, emailId2, contactNo2} = orgBranch || {};
        const org = {};// { name, taxId, websiteUrl, address, country, emailId1, contactNo1, emailId2, contactNo2 };
        let req = `${this.viewUrl}/html/${voucherMasterType}/${voucherId}`;
        if (key) {
            req = `${req}/${key}`;
        }
        return this.httpClient.post(req, org, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.getVoucherHtml(voucherMasterType, voucherId, key)))
            );
    }

    getVoucherPDF(voucherMasterType: string, voucherId: number) {
        const req = `${this.viewUrl}/pdf/${voucherMasterType}/${voucherId}`;
        const orgBranch = {};
        return this.httpClient
            .post(req, orgBranch, this.getFileDownloadRequestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.getVoucherPDF(voucherMasterType, voucherId)))
            );
    }

    getPdfReportOptions = () => this.httpClient
        .get(`${this.viewUrl}/report-options`, this.requestHeaders)
        .pipe(
            catchError(error => this.handleError(error, () => this.getPdfReportOptions()))
        );

    updatePaymentReceiptByGatewayMapperId(gatewayMapperId) {
        /*this.activeGateway = <LookupPaymentGateway>this.gateways.find(r => r.id == gatewayMapperId);
        const {isReferenceNoRequired, providerAccount, realizationAccount, serviceCharges} = this.activeGateway;
        this.gatewayServiceCharges = serviceCharges;
        let gatewayAccount: LookupGatewayAccountInfo;

        switch (this.voucherType.masterType){
            case VOUCHER_TYPES.PAYMENT: gatewayAccount = providerAccount; break;
            case VOUCHER_TYPES.RECEIPT: gatewayAccount = realizationAccount; break;
            default: gatewayAccount = null; break;
        }
        return { activeGateway: this.activeGateway, gatewayAccount};*/
    }
}