import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {DashboardPortletService} from "../services/dashboard-portlet.service";
import {PortletPermissionRuleForm} from "../form/portlet-permission-rule.form";

@Component({
  styles: [`:host{ display: contents; }`],
  templateUrl: './templates/dashboard-portlet-rule.html'
})
export class DashboardPortletRuleComponent extends PortletPermissionRuleForm {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  @Input() set data(info) { this.populateForm(info); }

  submitted: boolean = false;
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }
  constructor(public fb: FormBuilder, private service: DashboardPortletService) { super(fb); }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    const formData = form.getRawValue();

    const success=(resp: any)=>{
        this.submitted = false;
        this.onOk.emit(true);
    };
    const failure=(resp: any)=>{
        this.submitted = false;
    };

    if(this.id) {
      this.service.update(this.id, formData).subscribe(success, failure);
    } else {
      this.service.create(formData).subscribe(success, failure);
    }
  }
}
