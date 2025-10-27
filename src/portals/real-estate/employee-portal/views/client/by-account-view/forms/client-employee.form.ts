import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";
import {Contact} from "../domains/contact.serializer";

@Directive()
export class ClientEmployeeForm
{
    relationType: string = 'existing';
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            title: [''],
            fName: ['', Validators.required],
            lName: [''],
            phone: [''],
            email: [''],
            accountId: [null, Validators.required],
            relationTypeId: ['', Validators.required],
            relationName: ['']
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formRelationTypeId() {
        return <FormGroup>this.customForm.get('relationTypeId');
    }

    updateRelationType(val){
        this.formRelationTypeId.setValue(val);
    }

    populateClientContacts(item: Contact){
        const { id, title, fName, lName, phone, email, relationTypeId, accountId } = item || <Contact>{};
        this.customForm.get('id').setValue(id);
        this.customForm.get('title').setValue(title);
        this.customForm.get('fName').setValue(fName);
        this.customForm.get('lName').setValue(lName);
        this.customForm.get('phone').setValue(phone);
        this.customForm.get('email').setValue(email);
        this.customForm.get('relationTypeId').setValue(relationTypeId);
        this.customForm.get('accountId').setValue(accountId);
    }

    switchRelationType(val){
        this.relationType = val;
        if(val == 'new'){
            this.customForm.get('relationName').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(20)]);
            this.formRelationTypeId.clearValidators();
            this.formRelationTypeId.setValue(null);
        } else if(val== 'existing'){
            this.customForm.get('relationName').clearValidators();
            this.formRelationTypeId.setValidators([Validators.required]);
        }
    }
}