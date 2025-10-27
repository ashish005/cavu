import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {Driver} from "../domains/driver.serializer";

@Directive()
export class DriverForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            fName: [null, Validators.required],
            lName: [null, Validators.required],
            email: [null, Validators.required],
            phone: [null, Validators.required],
            //dob: [null, Validators.required],

            licenseTypeId: [null, Validators.required],
            dlNumber: [null, Validators.required],
            dlValidity: [null, Validators.required],
            dlDocumentId: [null],

            insuranceValidity: [null],
            joiningDate: [null],

            shiftId: [null, Validators.required],
            experience: [null],

            planId: ['']
        });
    }

    get formLicenseTypeId() { return <FormGroup>this.customForm.get('licenseTypeId'); }
    get formShiftId() { return <FormGroup>this.customForm.get('shiftId'); }

    get formPlanId() { return <FormGroup>this.customForm.get('planId'); }

    updateLicenseType(val){ this.formLicenseTypeId.setValue(val); }
    updateShift(val){ this.formShiftId.setValue(val); }
    updatePlan(val){ this.formPlanId.setValue(val); }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populate(item: Driver = <Driver>{}){
        const {
            fName, lName, email, phone, //dob,
            licenseTypeId, dlNumber, dlValidity, dlDocumentId,
            insuranceValidity, joiningDate, shiftId,
            experience, planId
        } = item || {};
        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('email').setValue(email);
        this.customForm.get('phone').setValue(phone);
        //this.customForm.get('dob').setValue(dob);

        this.customForm.get('licenseTypeId').setValue(licenseTypeId);

        this.customForm.get('dlNumber').setValue(dlNumber);
        this.customForm.get('dlValidity').setValue(dlValidity);

        this.customForm.get('insuranceValidity').setValue(insuranceValidity);

        this.customForm.get('joiningDate').setValue(joiningDate);
        this.customForm.get('shiftId').setValue(shiftId);
        this.customForm.get('experience').setValue(experience);

        this.customForm.get('planId').setValue(planId);
    }
}