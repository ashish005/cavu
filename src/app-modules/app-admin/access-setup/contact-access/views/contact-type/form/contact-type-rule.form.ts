import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactType, ContactTypeRule} from "../domains/contact-type.serializer";

export class ContactTypeRuleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required],
      isRequired: [false],
      rules: this.fb.array([])
    });
  }

  getRuleFormGroup(data: ContactTypeRule){
    const { id, contactTypeId, userTypeId, userTypeName, isVerificationRequired, isMandatory, status } = data;
    return this.fb.group(<any>{
      id: [id],
      userTypeId: [userTypeId, Validators.required],
      contactTypeId: [contactTypeId, Validators.required],
      userTypeName: [userTypeName],

      isVerificationRequired: [isVerificationRequired],
      isMandatory: [isMandatory],
      status: [status]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formRules() { return <FormArray>this.customForm.get('rules'); }

  addToFormRule(item) { this.formRules.push(this.getRuleFormGroup(item)); }

    populateForm(data: ContactType) {
        const { name, isRequired, rules } = data;
        this.customForm.get('name').setValue(name);
        this.customForm.get('isRequired').setValue(isRequired);

        this.formRules.controls.length = 0;
        (rules || []).map((r: ContactTypeRule) => {
            this.addToFormRule(r);
        });
    }
}
