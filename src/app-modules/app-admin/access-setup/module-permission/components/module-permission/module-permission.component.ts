import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Component, Input, OnInit, Output} from "@angular/core";
import {RolePermissionService} from "../../services/role-permission.service";

@Component({
  selector: 'module-permission',
  templateUrl: './module-permission.html'
})
export class ModulePermissionComponent implements OnInit{
  submitted: boolean = false;
  @Input() customForm: FormGroup;
  constructor(public fb: FormBuilder, public service: RolePermissionService) {}

  ngOnInit(){}

  get f() { return this.customForm.controls; }

  get formRuleItem(): FormArray{
    return <FormArray>this.customForm.get('modulePermission');
  }

  updateAllFields(isChecked: boolean, formPermission: FormGroup){

    formPermission.get('allow').setValue(isChecked);
    formPermission.get('deny').setValue(isChecked);
    formPermission.get('view').setValue(isChecked);
    formPermission.get('modify').setValue(isChecked);
    formPermission.get('create').setValue(isChecked);
    formPermission.get('delete').setValue(isChecked);
    formPermission.get('destroy').setValue(isChecked);
    formPermission.get('import').setValue(isChecked);
    formPermission.get('export').setValue(isChecked);
    formPermission.get('manage').setValue(isChecked);

    formPermission.get('fullAccess').setValue(isChecked);
  }

  onViewCheckChange(isChecked: boolean, formPermission: FormGroup){
    if(formPermission.get('fullAccess').value && !isChecked){
      this.updateAllFields(false, formPermission);
    }
  }

  onCheckChange(isChecked: boolean, dataItem: FormGroup){

    const isAnyChecked = (dataItem.get('view').value ||
      dataItem.get('modify').value ||
      dataItem.get('create').value ||
      dataItem.get('delete').value ||
      dataItem.get('destroy').value ||
      dataItem.get('import').value ||
      dataItem.get('export').value ||
      dataItem.get('manage').value);
    dataItem.get('view').setValue(isAnyChecked);

    const hasFullAccess = (dataItem.get('view').value &&
      dataItem.get('modify').value &&
      dataItem.get('create').value &&
      dataItem.get('delete').value &&
      dataItem.get('destroy').value &&
      dataItem.get('import').value &&
      dataItem.get('export').value &&
      dataItem.get('manage').value);

    dataItem.get('fullAccess').setValue(hasFullAccess);
  }
}
