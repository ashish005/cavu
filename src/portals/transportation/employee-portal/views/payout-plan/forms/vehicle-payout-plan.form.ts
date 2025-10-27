import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DriverPayoutPlanHead} from "../domains/driver-payout-plan.serializer";
import {VehiclePayoutPlan} from "../domains/vehicle-payout-plan.serializer";

export class VehiclePayoutPlanForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            name: [null, Validators.required],
            planHeads: this.fb.array([])
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formName() { return this.customForm.get('name'); }
    get formPayoutFrequency() { return this.customForm.get('payoutFrequency'); }
    public get formPlanHeads() { return this.customForm.get('planHeads') as FormArray<FormGroup>; }
    populateForm(data: VehiclePayoutPlan) {
        this.customForm.get('id').setValue(data.id);
        this.customForm.get('name').setValue(data.name);

        this.formPlanHeads.controls.length = 0;
        (data.planHeads || []).map((r) => this.addNewRow(r));
    }

    addNewRow(data) { this.formPlanHeads.push(this.initItemRows(data)); }

    initItemRows(data: DriverPayoutPlanHead) {
        const { id, amount, basedOn, frequency, headId, headName, isActive } = data;
        return this.fb.group({
            id: [id || null],
            headName: [headName || null, Validators.required],
            headId: [headId || null, Validators.required],
            amount: [amount || null, Validators.required],
            basedOn: [basedOn || null, Validators.required],
            frequency: [frequency || null, Validators.required],
            isActive: [ isActive || false ]
        });
    }
}
