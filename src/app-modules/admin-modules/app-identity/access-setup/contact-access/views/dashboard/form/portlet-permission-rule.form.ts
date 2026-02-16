import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Injectable} from "@angular/core";
import {DashboardPortlet} from "../domains/dashboard-portlet.serializer";

@Injectable()
export class PortletPermissionRuleForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: [null, Validators.required],
      code: [null],
      description: [null],
      footer: [null],
      userTypeId: ['', Validators.required],
      sortOrder: [''],
      isVisible: [true],
      status: [null],
      permissions: this.fb.array([])
    });
  }

  getPortletPermissionFormGroup(data){
    return this.fb.group(<any>{
      id: [data.id],
      portletId: [data.portletId],
      isVisible: [data.isVisible],
      userRoleId: [data.userRoleId],
      userRoleName: [{value: data.userRoleName, disabled:true}],
      status: [data.status]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formRule() { return this.customForm.get('permissions') as FormArray<FormGroup>; }
  get formUserType() { return <FormGroup>this.customForm.get('userTypeId'); }

  addToFormRule(item){
    this.formRule.push(this.getPortletPermissionFormGroup(item));
  }

  populateForm(data: DashboardPortlet) {
    const { name, code, description, footer, userTypeId, id, sortOrder, isVisible, status, rolePermissions } = data;

      this.customForm.get('name').setValue(name);
      this.customForm.get('code').setValue(code);
      this.customForm.get('description').setValue(description);
      this.customForm.get('footer').setValue(footer);
      this.customForm.get('userTypeId').setValue(userTypeId);
      this.customForm.get('sortOrder').setValue(sortOrder);
      this.customForm.get('isVisible').setValue(isVisible);
      this.customForm.get('status').setValue(status);

      this.formRule.controls.length = 0;
      (rolePermissions || []).map(r => {
          const item = {
              id: r.id,
              portletId: id,
              isVisible: r.isVisible || false,
              isActive: r.isActive || false,
              userTypeId: r.userTypeId,
              userRoleName: r.userRoleName,
              userRoleId: r.userRoleId
          };
          this.addToFormRule(item);
      });
  }
}
