import {GatewayMapper, LookupQueryOptions, ModeGatewayMapper} from "./model/payment-mode";
import {Directive, Injector, Input} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import { pairwise, startWith, catchError, map, Observable, of, tap } from "rxjs";
import {CoreEndpointBase, VOUCHER_TYPES} from "@app-global";

@Directive()
export class ModeExtension extends CoreEndpointBase {
    isLoading: boolean = false;

    paymentModes: Array<GatewayMapper> = [];
    receiptModes: Array<GatewayMapper> = [];
    modes: Array<ModeGatewayMapper> = [];
    paymentModeInfo: ModeGatewayMapper;

    @Input() customForm: FormGroup;
    get formPartyAccountId (): FormGroup { return <FormGroup>this.customForm.get('partyAccountId'); }
    get formPartyAccountGroupId (): FormGroup { return <FormGroup>this.customForm.get('partyAccountGroupId'); }

    get formVoucherMasterType (): FormGroup { return <FormGroup>this.customForm.get('voucherMasterType'); }
    get formCurrencyRate (): FormGroup { return <FormGroup>this.customForm.get('currencyRate'); }
    get formCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('currencyCode'); }
    get formCurrencySymbol (): FormGroup { return <FormGroup>this.customForm.get('currencySymbol'); }

    get formSystemCurrencyCode (): FormGroup { return <FormGroup>this.customForm.get('systemCurrencyCode'); }

    get isPayment (){ return (this.formVoucherMasterType.value == VOUCHER_TYPES.PAYMENT || this.formVoucherMasterType.value == VOUCHER_TYPES.PURCHASE); }
    get isReceipt () { return (this.formVoucherMasterType.value == VOUCHER_TYPES.RECEIPT || this.formVoucherMasterType.value == VOUCHER_TYPES.SALE); }

    get formVoucherItems (): FormArray{ return <FormArray>this.customForm.get('items'); }
    get formTrxn() { return <FormGroup>this.customForm.get('trxn'); }
    get formForeign() { return <FormGroup>this.customForm.get('foreign'); }
    get formTrxnControl() { return this.formTrxn.controls; }

    get formPaymentGatewayMapperId() { return <FormGroup>this.formTrxn.get('gatewayMapperId'); }
    get formGatewayAccountId() { return <FormGroup>this.formTrxn.get('gatewayAccountId'); }
    get formGatewayAccountGroupId() { return <FormGroup>this.formTrxn.get('gatewayAccountGroupId'); }
    get formTrxnModeId() { return <FormGroup>this.formTrxn.get('modeId'); }

    get formPaymentSystemMasterType() { return <FormGroup>this.formTrxn.get('paymentSystemMaster'); }

    get formIsReferenceNoRequired() { return <FormGroup>this.formTrxn.get('isReferenceNoRequired'); }
    get formTrxnReferenceNo() { return <FormGroup>this.formTrxn.get('referenceNo'); }

    get formTrxnBalance() { return <FormGroup>this.formTrxn.get('balance'); }
    get formTrxnAmount() { return <FormGroup>this.formTrxn.get('amount'); }
    get formTrxnForeignAmount() { return <FormGroup>this.formForeign.get('amount'); }

    constructor(public override injector: Injector) { super(injector); }

    ngOnInit(){
        this.loadPaymentGateways();

        const masterTypeChanges = ([prev, next]: [any, any]) => {
            if(prev != next) { this.populateModes(); }
        };

        this.formVoucherMasterType.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(masterTypeChanges);
    }

    loadPaymentGateways(){
        this.isLoading = true;
        return this.getByControlType().pipe(
            catchError(() => of([])), // empty list on error
            tap((r) => { this.isLoading = false; }),
            map(resp => this.convertData(resp.data))
        ).subscribe(r => {
            this.populateModes();
        });
    }

    populateModes(){
        if(this.isPayment){ this.modes = this.paymentModes.reduce((r, curr)=> { r.push(...curr.groups); return r; },[]); }
        if(this.isReceipt){ this.modes = this.receiptModes.reduce((r, curr)=> { r.push(...curr.groups); return r; },[]); }
    }

    getByControlType(): Observable<any> {
        const q = new LookupQueryOptions();
        // q.isItemInvoice = `${!!this.isItemInvoice}`;
        // q.isCreditTrxn = `${!!this.isCreditTrxn}`;
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}/paymentGatewayLookup/paymentModes`, this.requestHeaders)//?${q.toQueryString()}
            .pipe(
                //tap(data => super.notifyResponse(data)),
                catchError(error => this.handleError(error, () => this.getByControlType()))
            );
    }

    private convertData(data: any)
    {
        this.paymentModes = (data.paymentGateways || []).map(r => new GatewayMapper(r));
        this.receiptModes = (data.receiptGateways || []).map(r => new GatewayMapper(r));
    }
}