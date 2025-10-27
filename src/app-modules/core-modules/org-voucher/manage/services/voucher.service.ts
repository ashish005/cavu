import {Injectable, Injector} from "@angular/core";
import {AppLookup, CoreService, OrgResourceService, OrgOptions, OrgConfigOptions} from "@app-global";
import { catchError, tap, BehaviorSubject, Observable } from "rxjs";
import {FinanceVoucher, FinanceVoucherSerializer} from "../domains/finance-voucher.serializer";

@Injectable()
export class VoucherService extends OrgResourceService<FinanceVoucher> {
    voucher: FinanceVoucher;

    private $syncVoucher: BehaviorSubject<FinanceVoucher> = new BehaviorSubject<FinanceVoucher>(null);
    syncVoucher(data: any) { this.$syncVoucher.next(data); }
    syncVoucherListener(): Observable<any> { return this.$syncVoucher.asObservable(); }

    constructor(public override injector: Injector) { super(injector, 'invoice', new FinanceVoucherSerializer()); }

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
