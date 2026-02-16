import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {ContactTypeRuleForm} from "../form/contact-type-rule.form";
import {ContactTypeService} from "../services/contact-type.service";

@Component({
    standalone: false,
  templateUrl: './templates/contact-type-rule.html',
  styles: [`:host{ display: contents; }`]
})
export class ContactTypeRuleCeComponent extends ContactTypeRuleForm {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }
  @Input() id: any;
  @Input() set data(info) { this.populateForm(info); }
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  submitted: boolean = false;
  categories: Array<any>;
  constructor(public override fb: FormBuilder, public service: ContactTypeService) {
    super(fb);
  }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
      const success=(resp: any)=>{
          this.submitted = false;
          this.onOk.emit(true);
      };
      const failure=(resp: any)=>{
          this.submitted = false;
      };

      if(this.id) {
          this.service.update(this.id, form.value).subscribe(success, failure);
      } else {
          this.service.create(form.value).subscribe(success, failure);
      }
  }
}
