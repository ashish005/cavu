import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgProcessForm} from "../forms/org-process.form";
import {OrgProcessService} from "../services/org-process.service";
import {ACTION_ENUM} from "../../../../popup-module/app-popup.enum";
import {WorkflowPluginLookup, OrgWorkflowAPIResolver} from "../../../../services/orgwise/process.resolver";

@Component({
  standalone: false,
  selector: 'process-phase-transition',
  templateUrl: './templates/phase-transition-ce.html',
  styles: [`:host { display: contents; }`],
})
export class OrgProcessTransitioningCeView extends OrgProcessForm {
  lookup: WorkflowPluginLookup;
  //@ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  submitted: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  constructor(public override fb: FormBuilder, private service: OrgProcessService,
              private resolver: OrgWorkflowAPIResolver) {
    super(fb);
    this.lookup = resolver.masterType;
  }

  onSubmit(form: FormGroup) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }

    const success = (resp)=> {
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const error = (resp)=> {
      this.submitted = false;
    };

    const formData = form.getRawValue();

    this.submitted = true;
    if(this.id) {
      this.service.update(<any>this.id, formData).subscribe(success, error);
    } else {
      this.service.create(formData).subscribe(success, error);
    }
  }
}
