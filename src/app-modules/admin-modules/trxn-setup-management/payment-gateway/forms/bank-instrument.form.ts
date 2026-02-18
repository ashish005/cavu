import {Directive, EventEmitter, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Directive()
export class BankInstrumentForm {
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            name: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    populateForm(row: any)
    {
        const { id, name } = row || {};
        this.customForm.get('id').setValue(id);
        this.customForm.get('name').setValue(name);
    }
}