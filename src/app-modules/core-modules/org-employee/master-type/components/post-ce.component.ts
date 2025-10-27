import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {PostMasterService} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/post-ce.html'
})
export class PostCeComponent {
  @Input() actionType: string;
  @Input() id: any;
  @Input() set data(val: any) {
    this.customFrom.get('name').setValue((val)?val.name : null);
    this.formUserRoleId.setValue((val)?val.userRoleId : null);
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  submitted: boolean = false;
  customFrom: FormGroup;

  constructor(private fb: FormBuilder, public service: PostMasterService) {
    this.customFrom = this.fb.group({
      name: ['', Validators.required],
      userRoleId: [null, Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customFrom.controls; }

  get formUserRoleId() {
    return <FormGroup>this.customFrom.get('userRoleId');
  }

  updateUserRole(val){
    this.formUserRoleId.setValue(val);
  }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;

    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    }
  }
}
