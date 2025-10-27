import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

export class TrxnTypeAllocationForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            modeTypeId: [null],
            accountGroupId: [null],
            accountId: [null],
            isDefault: [null],
            isAllowed: [null],
            sortNo: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
}