import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";

@Directive()
export class ProjectEmployeeForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            title: [''],
            fName: ['', Validators.required],
            lName: [''],
            dob: [''],
            email: [''],
            phone: ['']
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    populateProjectEmployees(item: any){
        const { id, title, fName, lName, dob, email, phone } = item || {};
        this.customForm.get('title').setValue(title);
        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('dob').setValue(dob);
        this.customForm.get('email').setValue(email);
        this.customForm.get('phone').setValue(phone);
    }
}