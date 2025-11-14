import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

import {OrgProcessForm} from "../forms/org-process.form";
import {OrgProcessService} from "../services/org-process.service";
import {ACTION_ENUM} from "../../../../popup-module/app-popup.enum";
import {WorkflowPluginLookup, OrgWorkflowAPIResolver} from "../../../../services/orgwise/process.resolver";
import {Subscription} from "rxjs";

@Component({
  standalone: false,
  selector: 'org-process-ce',
  templateUrl: './templates/org-process-ce.html',
  styles: [`:host { display: contents; }`],
  providers: [OrgProcessService]
})
export class OrgProcessCeView extends OrgProcessForm implements OnInit, OnDestroy {
  lookup: WorkflowPluginLookup;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  //@ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  //@Input() parentId: number | string;
  @Input() id: any;
  submitted: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  subscribe: Subscription;
  isLoading: boolean = false;
  constructor(public override fb: FormBuilder,
              private service: OrgProcessService,
              private resolver: OrgWorkflowAPIResolver) {
    super(fb);
    this.lookup = resolver.masterType;
  }

  ngOnInit(){
    if(this.id) {
      this.isLoading = true;
      this.subscribe = this.service.read(this.id).subscribe(r => {
        this.isLoading = false;
        this.populateOrgProcess(r.data);
      }, ()=> { this.isLoading = false; });
    }
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
      this.service.update(this.id, formData).subscribe(success, error);
    } else {
      this.service.create(formData).subscribe(success, error);
    }
  }
  ngOnDestroy(){ this.subscribe?.unsubscribe(); }
}
