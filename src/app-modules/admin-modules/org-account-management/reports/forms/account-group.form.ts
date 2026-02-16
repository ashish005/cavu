import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class AccountGroupForm
{
    customFrom: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customFrom = this.fb.group({
            name: ['', Validators.required],
            isHighPriority: [false],
            isNominalGroup: [false],
            parentGroupId: [''],
            accountNatureId: ['', Validators.required],
            sortOrder: [null],
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customFrom.controls; }
    get formHighPriority() { return this.customFrom.get('isHighPriority'); }
    get formNominalGroup() { return this.customFrom.get('isNominalGroup'); }
    get formAccountGroup() { return <FormGroup>this.customFrom.get('parentGroupId'); }
    get formAccountNature() { return <FormGroup>this.customFrom.get('accountNatureId'); }

    updateAccountNature(val){
        this.formAccountNature.setValue(val);
        this.formAccountGroup.reset();
    }

    updateAccountGroup(val){ this.formAccountGroup.setValue(val); }

    populateAccountGroup(item: any){
        const { name, isHighPriority, isNominalGroup, accountNatureId, parentGroupId, sortOrder } = item;
        this.customFrom.get('name').setValue(name);
        this.customFrom.get('isHighPriority').setValue(isHighPriority);
        this.customFrom.get('isNominalGroup').setValue(isNominalGroup);
        this.customFrom.get('accountNatureId').setValue(accountNatureId);
        this.customFrom.get('parentGroupId').setValue(parentGroupId);
        this.customFrom.get('sortOrder').setValue(sortOrder);
    }
}
