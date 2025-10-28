import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DocumentType, DocumentTypeRule} from "../domains/document-type.serializer";

export class DocumentTypeRuleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required],
      categoryId: [null, Validators.required],
      minSize: [null],
      maxSize: [null],
      rules: this.fb.array([])
    });
  }

  getRuleFormGroup(data: DocumentTypeRule){
    const { id, documentTypeId, userTypeId, userTypeName, isVerificationRequired, isMandatory, status } = data;
    return this.fb.group(<any>{
      id: [id],
      userTypeId: [userTypeId, Validators.required],
      documentTypeId: [documentTypeId, Validators.required],
      userTypeName: [userTypeName],

      isVerificationRequired: [isVerificationRequired],
      isMandatory: [isMandatory],
      status: [status]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formRules() { return this.customForm.get('rules') as FormArray<FormGroup>;; }
  get formDocumentCategory() { return <FormGroup>this.customForm.get('categoryId'); }

  updateDocumentCategory(val){ this.formDocumentCategory.setValue(val); }
  addToFormRule(item) { this.formRules.push(this.getRuleFormGroup(item)); }

    populateForm(data: DocumentType) {
        const { id, name, categoryId, minSize, maxSize, rules } = data;
        this.customForm.get('name').setValue(name);
        this.customForm.get('categoryId').setValue(categoryId);
        this.customForm.get('minSize').setValue(minSize);
        this.customForm.get('maxSize').setValue(maxSize);

        this.formRules.controls.length = 0;
        (rules || []).map((r: DocumentTypeRule) => {
            this.addToFormRule(r);
        });
    }
}
