import { Component, Input, OnInit } from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RolePermissionService} from "../../services/role-permission.service";

export enum AUTH_Action {
  Add = "Add",
  Update = "Update",
}

@Component({
    standalone: false,
  selector: 'module-ce',
  templateUrl: './module-ce.html'
})
export class ModuleCeComponent {
  @Input() customForm: FormGroup;
  submitted: boolean = false;
  actionType: string = 'Create';
  pageAction: AUTH_Action = AUTH_Action.Add;
  constructor(public fb: FormBuilder, public service: RolePermissionService) {}

  get f() { return this.customForm.controls; }
  get id() { return this.customForm.get('id'); }

  onSubmit(row: any){
    this.submitted = true;

    if(this.pageAction == AUTH_Action.Update && this.id.value) {
      this.service.update(this.id.value, row).subscribe((resp: any) => {
        this.submitted = false;
      });
    } else if(this.pageAction == AUTH_Action.Add) {
      this.service.create(row).subscribe((resp: any) => {
        this.submitted = false;
      });
    }
  }
}
