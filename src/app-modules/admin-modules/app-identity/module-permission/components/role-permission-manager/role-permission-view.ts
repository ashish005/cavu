import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {forkJoin} from "rxjs";
import {ModuleRightsForm} from "../../forms/module-rights.form";
import {RolePermissionService, UserPermissionService} from "../../services/role-permission.service"

@Component({
    standalone: false,
  selector: 'role-permission',
  templateUrl: './templates/role-permission.html',
  styles: [':host { display: contents; }']
})
export class RolePermissionView extends ModuleRightsForm implements OnInit {
  isLoading: boolean;
  @Input() orgUserId: string;
  constructor(public override fb: FormBuilder,
              public service: UserPermissionService) {
    super(fb);
  }

  ngOnInit() {
      super.formModuleRight.disable();
      const success = (resp)=> {
          this.isLoading = false;
          this.updateBaseModuleRights(resp.entities);
      };
      const error = ()=> {this.isLoading = false;};

      this.isLoading = true;
      this.service.getModuleByOrgUserId(this.orgUserId).subscribe(success, error);
  }
}
