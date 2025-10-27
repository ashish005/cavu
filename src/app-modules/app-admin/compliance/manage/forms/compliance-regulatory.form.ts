import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ComplianceRegulatory} from "../domains/compliance-regulatory.serializer";

export class ComplianceRegulatoryForm {
    customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: [null, Validators.required],
            registrationNo: [null, Validators.required],
            registrationDate: [null, Validators.required],
            isRenewalRequired: [false],
            renewalDate: [null],
            url: [null],
            userId: [null],
            password: [null],
            status: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formRateMapperRule() { return <FormArray>this.customForm.get('rateMapperRule'); }
    get formTaxGroupId() { return <FormGroup>this.customForm.get('taxGroupId'); }
    populateForm(row: ComplianceRegulatory) {
        const {
            name,
            registrationNo, registrationDate,
            isRenewalRequired, renewalDate,
            url, userId, password, status
        } = row;
        this.customForm.get('name').setValue(name);
        this.customForm.get('registrationNo').setValue(registrationNo);
        this.customForm.get('registrationDate').setValue(registrationDate);
        this.customForm.get('isRenewalRequired').setValue(isRenewalRequired);
        this.customForm.get('renewalDate').setValue(renewalDate);
        this.customForm.get('url').setValue(url);
        this.customForm.get('userId').setValue(userId);
        this.customForm.get('password').setValue(password);
        this.customForm.get('status').setValue(status);
    }
}