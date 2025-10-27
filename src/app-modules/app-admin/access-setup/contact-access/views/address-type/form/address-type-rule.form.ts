import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AddressType, AddressTypeRule} from "../domains/address-type.serializer";

export class AddressTypeRuleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required],
      rules: this.fb.array([])
    });
  }

  getRuleFormGroup(data: AddressTypeRule){
    const { id, addressTypeId, userTypeId, userTypeName, isVerificationRequired, isMandatory, status } = data;
    return this.fb.group(<any>{
      id: [id],
      userTypeId: [userTypeId, Validators.required],
      addressTypeId: [addressTypeId, Validators.required],
      userTypeName: [userTypeName],

      isVerificationRequired: [isVerificationRequired],
      isMandatory: [isMandatory],
      status: [status]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formRules() { return <FormArray>this.customForm.get('rules'); }
  get formDocumentCategory() { return <FormGroup>this.customForm.get('categoryId'); }

  updateDocumentCategory(val){ this.formDocumentCategory.setValue(val); }
  addToFormRule(item) { this.formRules.push(this.getRuleFormGroup(item)); }

    populateForm(data: AddressType) {
        const { id, name, rules } = data;
        this.customForm.get('name').setValue(name);

        this.formRules.controls.length = 0;
        (rules || []).map((r: AddressTypeRule) => {
            this.addToFormRule(r);
        });
    }
}
