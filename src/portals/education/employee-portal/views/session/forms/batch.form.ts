import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class BatchForm {
    customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: [null, Validators.required],
            orgSessionId: [null, Validators.required],
            startDate: [null, Validators.required],
            studyModeTypeId: [null]// We do not want batch to be created for every study mode
        });
    }
    get formOrgSession() { return this.customForm.get('orgSessionId'); }
    get formStudyMode() { return this.customForm.get('studyModeTypeId'); }
    get formStartDate() { return this.customForm.get('startDate'); }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
}