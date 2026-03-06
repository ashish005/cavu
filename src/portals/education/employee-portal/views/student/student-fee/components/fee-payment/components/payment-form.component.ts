import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FeePaymentLookup, PaymentModeGatewayMapper} from "../domain/fee-payment.lookup";
import {pairwise, startWith} from "rxjs";
import {FeeSaleInvoiceService} from "../services/fee-sale-invoice.service";
import {FeePaymentAPIResolver} from "../services/api.resolver";

@Component({
    standalone: false,
    selector: 'payment-form',
    templateUrl: './templates/payment-form.html',
    styles: [ `:host { display: contents;}`]
})
export class PaymentFormComponent implements OnInit {
    @Input() lookup: FeePaymentLookup;
    @Input() customForm: FormGroup;

    @Output() onPayment: EventEmitter<any> = new EventEmitter<any>();
    paymentModeInfo: PaymentModeGatewayMapper;
    submitted: boolean = false;
    constructor(public fb: FormBuilder, private lookupService: FeePaymentAPIResolver, private service: FeeSaleInvoiceService) {
    }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formPayment() { return <FormGroup>this.customForm?.get('payment'); }

    get formPayAmount() { return <FormGroup>this.formPayment.get('payAmount'); }
    get formTotalVoucherFee() { return <FormGroup>this.formPayment.get('totalAmount'); }

    get formPaymentGatewayId() { return <FormGroup>this.formPayment.get('paymentGatewayId'); }
    get formPaymentGatewayMapperId() { return <FormGroup>this.formPayment.get('gatewayMapperId'); }
    get formPaymentModeId() { return <FormGroup>this.formPayment.get('paymentModeId'); }
    get formPaymentGatewayAccountId() { return <FormGroup>this.formPayment.get('gatewayAccountId'); }
    get formPaymentGatewayAccountGroupId() { return <FormGroup>this.formPayment.get('gatewayAccountGroupId'); }

    get formPaymentSystemTypeId() { return <FormGroup>this.formPayment.get('systemTypeId'); }

    ngOnInit(){
        const itemFormValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                const paymentModeInfo: PaymentModeGatewayMapper = this.lookup.getPaymentModeById(next);
                const {
                    id, gatewayId, name,
                    isPaymentAllowed, isReceiptAllowed, isReferenceNoRequired,
                    modeId, systemTypeId,
                    providerAccount, realizationAccount, serviceCharges
                } = paymentModeInfo;

                this.formPaymentModeId.setValue(<any>modeId);
                this.formPaymentSystemTypeId.setValue(<any>systemTypeId);
                // (paymentModeInfo.children || []).find(r => r.id == childId) || new PaymentGateway();
                this.formPaymentGatewayMapperId.setValue(<any>id);
                this.formPaymentGatewayId.setValue(<any>gatewayId);
                this.formPaymentGatewayAccountId.setValue(<any>providerAccount.accountId);
                this.formPaymentGatewayAccountGroupId.setValue(<any>providerAccount.accountGroupId);
                this.paymentModeInfo = paymentModeInfo;
            }
        };
        this.formPaymentGatewayMapperId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormValueChange);
    }

    onFeePayment(){
        if(this.customForm.invalid){
            return;
        }
        this.submitted = true;
        const success = (resp)=> {
            this.submitted = false;
            this.onPayment.emit(resp);
        };

        const failure = (resp)=> {
            this.submitted = false;
        };
        const rowData = this.customForm.getRawValue();
        this.service.create(rowData).subscribe(success, failure);
    }
}