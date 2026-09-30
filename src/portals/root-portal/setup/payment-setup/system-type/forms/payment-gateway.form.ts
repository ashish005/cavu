import {Directive, EventEmitter, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentGateway} from "../domains/payment-gateway.serializer";

@Directive()
export class PaymentGatewayForm {
    customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            name: [null],
            isPOS: [false],
            isMobileWallet: [false],
            hasOptionalRefNo: [false],

            identificationNo: [null],

            providerSupportNo: [null],
            providerAccountId: [null],
            realizationAccountId: [null],

            isReferenceNoRequired: [true],
            isReconciliationRequired: [false],

            systemTypeId: [null, Validators.required],
            modeGatewayMapper: this.fb.array([]),

            providerAccountName: [null],
            realizationAccountName: [null],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formGatewayId(){ return this.customForm.get('id'); }
    get formSystemTypeId(){ return this.customForm.get('systemTypeId'); }
    get formProviderAccountId(){ return this.customForm.get('providerAccountId'); }
    get formProviderAccount(){ return this.customForm.get('providerAccountName'); }
    get formRealizationAccountId(){ return this.customForm.get('realizationAccountId'); }
    get formRealizationAccount(){ return this.customForm.get('realizationAccountName'); }
    get formModeGatewayMapper(){ return this.customForm.get('modeGatewayMapper') as FormArray<FormGroup>; }

    get formIsPOS(){ return this.customForm.get('isPOS'); }
    get formHasOptionalRefNo(){ return this.customForm.get('hasOptionalRefNo'); }


    updateProviderAccount(val: any){
        const { accountId, accountName } = val || {};
        this.formProviderAccountId.setValue(accountId, { emitEvent: false});
        this.formProviderAccount.setValue(accountName, { emitEvent: false});
    }

    updateRealizationAccount(val: any){
        const { accountId, accountName } = val || {};
        this.formRealizationAccountId.setValue(accountId, { emitEvent: false});
        this.formRealizationAccount.setValue(accountName, { emitEvent: false});
    }

    populateForm(row: PaymentGateway)
    {
        const {
            id, name, systemTypeId,
            isPOS, hasOptionalRefNo, identificationNo,
            isReferenceNoRequired, isMobileWallet, isReconciliationRequired, providerSupportNo,
            providerAccountId, providerAccountName, realizationAccountId, realizationAccountName,
            modeGatewayMapper
        } = row || {};
        this.customForm.get('id').setValue(id);
        this.customForm.get('name').setValue(name);
        this.customForm.get('systemTypeId').setValue(systemTypeId);

        this.customForm.get('isPOS').setValue(isPOS);
        this.customForm.get('hasOptionalRefNo').setValue(hasOptionalRefNo);
        this.customForm.get('isMobileWallet').setValue(isMobileWallet);

        this.customForm.get('identificationNo').setValue(identificationNo);
        this.customForm.get('isReferenceNoRequired').setValue(isReferenceNoRequired);
        this.customForm.get('providerSupportNo').setValue(providerSupportNo);

        this.customForm.get('isReconciliationRequired').setValue(isReconciliationRequired);

        this.formModeGatewayMapper.controls.length = 0;
        (modeGatewayMapper || []).map(r => this.formModeGatewayMapper.push(this.getModeGatewayMapperFormGroup(r)));

        this.customForm.get('providerAccountId').setValue(providerAccountId);
        this.customForm.get('providerAccountName').setValue(providerAccountName);
        this.customForm.get('realizationAccountId').setValue(realizationAccountId);
        this.customForm.get('realizationAccountName').setValue(realizationAccountName);
    }

    getModeGatewayMapperFormGroup(data){
        const { id, gatewayId, modeId, modeName, isReceiptAllowed, isPaymentAllowed, status } = data || {};
        return this.fb.group({
            id: [id || null],
            gatewayId: [gatewayId],
            modeId: [modeId || null, Validators.required],
            modeName: [modeName || null, Validators.required],
            isReceiptAllowed: [isReceiptAllowed ||  null],
            isPaymentAllowed: [isPaymentAllowed ||  null],
            status: [status ||  false]
        });
    }
}