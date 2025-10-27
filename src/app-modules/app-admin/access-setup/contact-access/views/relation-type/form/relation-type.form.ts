import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RelationType} from "../domains/relation-type.serializer";

export class RelationTypeForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

    populateForm(data: RelationType) {
        const { name } = data;
        this.customForm.get('name').setValue(name);
    }
}
