import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FeePenaltyType} from "../domains/fee-penalty-type.serializer";
import {CALC_TYPE, PENALTY_FREQUENCY_TYPE} from "@app-global";

export class FeePenaltyTypeForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            rules: this.fb.array([])
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get feePenaltyRules(): FormArray<FormGroup>{ return this.customForm.get('rules') as FormArray<FormGroup>;}

    populateData(data: FeePenaltyType){
        this.customForm.get('id').setValue(data.id);
        this.customForm.get('name').setValue(data.name);

        this.feePenaltyRules.controls.length = 0;
        (data.rules || [{}]).map((r)=> this.addNewRow(r));
    }

    initRuleRows(data) {
        const form = this.fb.group({
            id: [ data?.id || null],
            //feePenalityTypeId: [ data?.feePenalityTypeId || null],
            isBalanceDue: [ data?.isBalanceDue || false ],
            penaltyFrequency: [ data?.penaltyFrequency || PENALTY_FREQUENCY_TYPE.DAILY ],
            fromDay: [ data?.fromDay || 1 ],
            toDay: [ data?.toDay || 45 ],

            calculationType: [data?.calculationType || CALC_TYPE.PERCENTAGE],
            value: [data?.value || 0.00, Validators.required]
        });
        return form;
    }

    addNewRow(data) { this.feePenaltyRules.push(this.initRuleRows(data));}

    deleteRow(index: number) { this.feePenaltyRules.removeAt(index); }
}