import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserType, UserRole, UserRelation} from "../domains/user-type.serializer";

export class UserTypeRuleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required],
      isActive: [false],
      userRoles: this.fb.array([]),
      userRelations: this.fb.array([])
    });
  }

  getRoleFormGroup(data: UserRole){
    const { id, name, userTypeId, isActive, isLocked } = data;
    return this.fb.group(<any>{
      id: [id],
      name: [name, Validators.required],
      isActive: [isActive],
      isLocked: [isLocked]
    });
  }

    getRelationFormGroup(data: UserRelation){
        const { id, name, userTypeId, isActive, isLocked } = data;
        return this.fb.group(<any>{
            id: [id],
            name: [name, Validators.required],
            isActive: [{value: isActive, disabled: true}],
            isLocked: [{value: isLocked, disabled: true}]
        });
    }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formRoles() { return this.customForm.get('userRoles') as FormArray<FormGroup>; }
  get formRelations() { return this.customForm.get('userRelations') as FormArray<FormGroup>; }

  addToFormRole(item) { this.formRoles.push(this.getRoleFormGroup(item)); }
  addToFormRelation(item) { this.formRelations.push(this.getRelationFormGroup(item)); }
    populateForm(data: UserType) {
        const { name, isActive, userRoles, userRelations } = data;
        this.customForm.get('name').setValue(name);
        this.customForm.get('isActive').setValue(isActive);

        this.formRoles.controls.length = 0;
        this.formRelations.controls.length = 0;
        (userRoles || []).map((r: UserRole) => { this.addToFormRole(r); });
        (userRelations || []).map((r: UserRelation) => { this.addToFormRelation(r); });
    }
}
