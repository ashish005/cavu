import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable()
export class RoleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [ null, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
}
