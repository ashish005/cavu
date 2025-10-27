import {Component, EventEmitter, Injector, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {CoreEndpointBase} from "../../../../../app/global/services/endpoint-base.service";

class GatewayServiceCharge {
    id: number;
    mapperId: number;
    cardTypeId: number;
    serviceChargeRate: number;
    taxRate: number;
    trxnAmountFrom: number;
    trxnAmountTo: number;

    cardTypeName: string;
    status: string;

    constructor(model: any = <any>{}) {
        this.id = model.id;
        this.mapperId = model.mapperId;
        this.cardTypeId = model.cardTypeId;
        this.serviceChargeRate = model.serviceChargeRate;

        this.taxRate = model.taxRate;
        this.trxnAmountFrom = model.trxnAmountFrom;
        this.trxnAmountTo = model.trxnAmountTo;

        this.cardTypeName = model.cardTypeName;
        this.status = model.status;
    }
}
class ModeGatewayMapper {
    id: string;
    name: string;
    modeId: number;
    gatewayId: number;

    isReferenceNoRequired: boolean;
    hasAccount: boolean;

    systemTypeId: number;
    paymentSystemMaster: string;
    serviceCharges: Array<GatewayServiceCharge>;

    accountId: string;
    accountGroupId: number;

    constructor(model: any = {}) {
        const {
            id, name, gatewayId, isReferenceNoRequired,
            modeId, systemTypeId, paymentSystemMaster,
            hasAccount, accountId, accountGroupId, serviceCharges
        } = model;

        this.id = id;
        this.name = name;
        this.modeId = modeId;
        this.gatewayId = gatewayId;
        this.isReferenceNoRequired = isReferenceNoRequired;
        this.hasAccount = hasAccount;

        this.systemTypeId = systemTypeId;
        this.paymentSystemMaster = paymentSystemMaster;
        this.accountId = accountId;
        this.accountGroupId = accountGroupId;
        this.serviceCharges = (serviceCharges || []).map(r => new GatewayServiceCharge(r));
    }
}

class GatewayMapper {
    systemTypeId: number;
    systemTypeName: string;
    groups: Array<ModeGatewayMapper>;

    constructor(model: any = {}) {
        const { systemTypeId, systemTypeName, groups } = model;
        this.systemTypeId = systemTypeId;
        this.systemTypeName = systemTypeName;
        this.groups = (groups || []).map(r => new ModeGatewayMapper(r));
    }
}

@Component({
    selector: 'payment-option',
    templateUrl: './payment-form.html',
    styles: [ `:host { display: contents;}`], standalone: false
})
export class PaymentComponent extends CoreEndpointBase implements OnInit {
    paymentModes: Array<GatewayMapper> = [];
    receiptModes: Array<GatewayMapper> = [];
    customForm: FormGroup;

    @Input() isPayment: boolean = false;
    @Input() isReceipt: boolean = false;

    @Input() set data(val) { this.customForm.patchValue(val); }

    @Output() onPayment: EventEmitter<any> = new EventEmitter<any>();

    modes: Array<GatewayMapper> = [];
    paymentModeInfo: ModeGatewayMapper;
    submitted: boolean = false;
    isLoading: boolean = false;
    constructor(public injector: Injector, public fb: FormBuilder)
    {
        super(injector);
        const saleDate = null;//this.toyyyymmdd(data.saleDate || '');
        this.customForm = this.fb.group(<any>{
            id: [null],
            partyId: [{value: null, disabled: true }],
            userId: [{value: null, disabled: true }],
            voucherNo: [null],

            saleDate: [saleDate],
            paymentSystemMaster: [null],
            modeId: [null],
            amount: [ {value: null, disabled: true } ],

            gatewayMapperId: [null],
            gatewayAccountId: [null],
            gatewayAccountGroupId: [null],
            refTransactionNo: [null],
            // refVoucherId: [data.refVoucherId],
            // reVoucherNo: [data.refVoucherNo],
            // refVoucherTypeId: [data.refVoucherTypeId]
            remark: [null]
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formAmount() { return <FormGroup>this.customForm.get('amount'); }

    //get formPaymentGatewayId() { return <FormGroup>this.customForm.get('paymentGatewayId'); }
    get formPaymentGatewayMapperId() { return <FormGroup>this.customForm.get('gatewayMapperId'); }
    get formPaymentModeId() { return <FormGroup>this.customForm.get('modeId'); }
    get formPaymentGatewayAccountId() { return <FormGroup>this.customForm.get('gatewayAccountId'); }
    get formPaymentGatewayAccountGroupId() { return <FormGroup>this.customForm.get('gatewayAccountGroupId'); }

    get formPaymentSystemMasterType() { return <FormGroup>this.customForm.get('paymentSystemMaster'); }

    ngOnInit(){
        this.isLoading = true;
        const lookup = this.httpClient.get(`${this.baseSectorAPIUrl}paymentGatewayLookup/paymentModes`, this.requestHeaders).toPromise();
        lookup.then((r: any)=> {
            this.isLoading = false;
            this.paymentModes = (r.data.paymentGateways || []).map(r => new GatewayMapper(r));
            this.receiptModes = (r.data.receiptGateways || []).map(r => new GatewayMapper(r));

            if(this.isPayment){ this.modes = this.paymentModes.reduce((r, curr)=> { r.push(...curr.groups); return r; },[]); }
            if(this.isReceipt){ this.modes = this.receiptModes.reduce((r, curr)=> { r.push(...curr.groups); return r; },[]); }
        });

        const itemFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                const paymentModeInfo: ModeGatewayMapper = (this.modes || []).find(r => r.id == next);
                const { id, gatewayId, name, isReferenceNoRequired, modeId, systemTypeId, paymentSystemMaster, accountId, accountGroupId, serviceCharges } = paymentModeInfo;

                this.formPaymentModeId.setValue(<any>modeId);
                this.formPaymentSystemMasterType.setValue(<any>paymentSystemMaster);
                this.formPaymentGatewayMapperId.setValue(<any>id);
                this.formPaymentGatewayAccountId.setValue(<any>accountId);
                this.formPaymentGatewayAccountGroupId.setValue(<any>accountGroupId);
                this.paymentModeInfo = paymentModeInfo;
            }
        };
        this.formPaymentGatewayMapperId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
    }

    onFeePayment(){
        if(this.customForm.invalid){
            return;
        }
        this.onPayment.emit(this.customForm.getRawValue());
    }
}
