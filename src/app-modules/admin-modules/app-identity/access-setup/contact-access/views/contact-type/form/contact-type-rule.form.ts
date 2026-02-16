import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactType, ContactTypeRule} from "../domains/contact-type.serializer";

export class ContactTypeRuleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required],
      isRequired: [false],
      isActive: [false],
      rulePermissions: this.fb.array([])
    });
  }

  getRuleFormGroup(data: ContactTypeRule){
    const { id, contactTypeId, userTypeId, userTypeName, isVerificationRequired, isMandatory, isActive } = data;
    return this.fb.group(<any>{
      id: [id],
      userTypeId: [userTypeId, Validators.required],
      contactTypeId: [contactTypeId, Validators.required],
      userTypeName: [userTypeName],

      isVerificationRequired: [isVerificationRequired],
      isMandatory: [isMandatory],
        isActive: [isActive]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formRules() { return this.customForm.get('rulePermissions') as FormArray<FormGroup>; }

  addToFormRule(item) { this.formRules.push(this.getRuleFormGroup(item)); }

    populateForm(data: ContactType) {
        const { name, isRequired, isActive, rulePermissions } = data;
        this.customForm.get('name').setValue(name);
        this.customForm.get('isRequired').setValue(isRequired);
        this.customForm.get('isActive').setValue(isActive);
        this.formRules.controls.length = 0;
        (rulePermissions || []).map((r: ContactTypeRule) => {
            this.addToFormRule(r);
        });
    }
}
