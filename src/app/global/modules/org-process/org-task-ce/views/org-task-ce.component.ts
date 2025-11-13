import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "../../../../global";
import {of, Subscription} from "rxjs";
import {OrgTaskForm} from "../forms/org-task.form";
import {OrgTaskService} from "../services/org-task.service";
import {EventTaskPluginResolver} from "../services/lookup.resolver";

@Component({
  selector: 'org-task-ce',
  templateUrl: './templates/org-task-ce.html',
  styles: [`:host{ display: contents; }`],
  providers: [OrgTaskService]
})
export class OrgTaskCeComponent extends OrgTaskForm implements OnInit, OnDestroy {
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Input() id: any;
  @Input() processId: any;
  submitted: boolean = false;
  processList: Array<any> =  [];
  subscriber: Subscription;
  isLoading: boolean;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  constructor(public fb: FormBuilder,
              public lookupResolver: EventTaskPluginResolver,
              private service: OrgTaskService) {
    super(fb);
  }

  ngOnInit(){
      // if(this.processId)
      // {
      //     this.processList = this.lookupResolver?.masterType?.getAllOrgProcessByRootProcessId(this.processId);
      // } else {
      //     this.processList = this.lookupResolver?.masterType.orgProcess;
      // }
      //this.processList = this.lookupResolver?.masterType.orgProcess;
      if(this.id)
      {
          const success = (r)=> { this.populateOrgTask(r.data); };
          const error = (r)=> { this.populateOrgTask(<any>{}); };
          this.subscriber = this.service.read(this.id).subscribe(success, error);
      }
  }

  ngOnDestroy(){
    this.subscriber?.unsubscribe();
  }
  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
        form.validate(); return;
    }

    const success = (resp)=> {
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const error = (resp)=> {
      this.submitted = false;
    };

    const data = form.getRawValue();
    this.submitted = true;
    if(this.id) {
      this.service.update(this.id, data).subscribe(success, error);
    } else {
      this.service.create(data).subscribe(success, error);
    }
  }
}
