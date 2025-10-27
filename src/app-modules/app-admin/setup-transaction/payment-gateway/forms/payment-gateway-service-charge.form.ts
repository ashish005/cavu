import {Directive} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {PaymentGateway} from "../domains/payment-gateway.serializer";

@Directive()
export class PaymentGatewayServiceChargeForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            paymentGatewayId: [null],
            serviceCharges: this.fb.array([])
        });
    }
    formGatewayServiceCharge(data){
        const { id, gatewayId, modeId, mapperId, cardTypeName, status, cardTypeId, serviceChargeRate, taxRate, trxnAmountFrom, trxnAmountTo } = data;
        return this.fb.group(<any>{
            id: [id],
            //gatewayId: [gatewayId],
            modeId: [modeId],
            mapperId: [mapperId],
            cardTypeId: [cardTypeId],
            serviceChargeRate: [serviceChargeRate],
            taxRate: [taxRate],
            trxnAmountFrom: [trxnAmountFrom],
            trxnAmountTo: [trxnAmountTo],
            status: [status],
            cardTypeName: [cardTypeName]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formGatewayServiceCharges (): FormArray{ return <FormArray>this.customForm.get('serviceCharges'); }
    addGatewayServiceCharge(val){ this.formGatewayServiceCharges.push(this.formGatewayServiceCharge(val)); }

    populateForm(item: PaymentGateway) {
        // let { id, serviceCharges } = item;
        // this.customForm.get('paymentGatewayId').setValue(id);
    }
}