import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CALC_TYPE} from "@app-global";

export class FeeConcessionForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            calculationType: [null, Validators.required],
            calculationValue: [null, Validators.required],
            remark: [null, Validators.required],
            reservationCategoryId: [null, Validators.required]
        });
    }

    populateData(data)
    {
        this.customForm.get('id').setValue(data.id);
        this.customForm.get('name').setValue(data.name);
        this.customForm.get('calculationType').setValue(data.calculationType || CALC_TYPE.PERCENTAGE);
        this.customForm.get('calculationValue').setValue(data.calculationValue ||  '0.00');
        this.customForm.get('remark').setValue(data.remark);
        this.customForm.get('reservationCategoryId').setValue(data.reservationCategoryId);
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
}