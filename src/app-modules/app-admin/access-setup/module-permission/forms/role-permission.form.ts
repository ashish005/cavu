import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Injectable} from "@angular/core";

@Injectable()
export class RolePermissionForm {
  customForm: FormGroup;
  permissionForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.createForm({});
  }

  createForm(data){
    return this.fb.group({
      name: [data.name],
      moduleRight: this.fb.array([])
    });
  }

  updateBaseModuleRightsByRole(data: Array<any>){
    this.formModuleRight.controls.length = 0;
    (data || []).map(r => { this.addToModuleRightFormRule(r); });
  }

  updateBaseModuleRights(data: Array<any>){
    this.formModuleRight.controls.length = 0;
    (data || []).map(r => { this.addToModuleRightFormRule(r); });

    if(!this.permissionForm){
      this.permissionForm = <FormGroup>this.formModuleRight.at(0);
    }
  }

  getModuleRightFormGroup(data){
    const dataItem = this.fb.group({
      id: [data.id || null],
      code: [data.code || null],
      name: [data.name ||  null],
      description: [data.description ||  null],
      allowed: [data.allowed ||  true],
      modulePermission: this.fb.array([])
    });

    (data.children || []).map(r => {
      (<FormArray>dataItem.get('modulePermission')).push(this.getModulePermissionFormGroup(r));
    });

    return dataItem;
  }

  getModulePermissionFormGroup(data){
    const dataItem = this.fb.group({
      id: [data.id || null],
      name: [data.name ||  null, Validators.required],
      code: [data.code || null, Validators.required],
      description: [data.description ||  null],
      allow: [data.allow ||  null],
      deny: [data.deny ||  null],
      fullAccess: [data.fullAccess],
      view: [data.view],
      modify: [data.modify],
      create: [data.create],
      delete: [data.delete],
      destroy: [data.destroy],
      import: [data.import],
      export: [data.export],
      manage: [data.manage]
    });

    const hasFullAccess = (dataItem.get('view').value &&
      dataItem.get('modify').value &&
      dataItem.get('create').value &&
      dataItem.get('delete').value &&
      dataItem.get('destroy').value &&
      dataItem.get('import').value &&
      dataItem.get('export').value &&
      dataItem.get('manage').value);

    dataItem.get('fullAccess').setValue(hasFullAccess);
    return dataItem;
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formModuleRight() {
    return <FormArray>this.customForm.get('moduleRight');
  }

  addToModuleRightFormRule(item){
    this.formModuleRight.push(this.getModuleRightFormGroup(item));
  }
}
