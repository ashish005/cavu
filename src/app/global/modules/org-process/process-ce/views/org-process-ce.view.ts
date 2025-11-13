import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {OrgProcessForm} from "../forms/org-process.form";
import {OrgProcessService} from "../services/org-process.service";
import {ACTION_ENUM} from "../../../../popup-module/app-popup.enum";
import {WorkflowPluginLookup, OrgWorkflowAPIResolver} from "../../../../services/orgwise/process.resolver";

@Component({
  standalone: false,
  selector: 'org-process-ce',
  templateUrl: './templates/org-process-ce.html',
  styles: [`:host { display: contents; }`]
})
export class OrgProcessCeView extends OrgProcessForm implements OnInit {
  lookup: WorkflowPluginLookup;
  //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  // @Input() parentId: number | string;
  // @Input() id: number;
  submitted: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  statusList: Array<any>;
  constructor(public override fb: FormBuilder, private service: OrgProcessService,
              private resolver: OrgWorkflowAPIResolver) {
    super(fb);
    this.lookup = resolver.masterType;
  }

  ngOnInit(){}

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
      this.service.update(this.id, formData).subscribe(success, error);
    } else {
      this.service.create(formData).subscribe(success, error);
    }
  }
}
