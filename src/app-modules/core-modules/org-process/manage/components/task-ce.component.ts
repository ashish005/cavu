import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {MONTHS, DAYS} from "@app-global";
import {OrgTask} from "../domains/org-task.serializer";
import {ACTION_ENUM, OrgWorkflowAPIResolver, WorkflowPluginLookup} from "@app-global";
import {OrgTaskService} from "../services/org-process-task.service";
export class OrgTaskForm {
  months: Array<any> = MONTHS;
  days: Array<any> = DAYS;
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: ['', Validators.required],
      remark: [null],
      taskTypeId: [null],
      orgProcessId: [null, Validators.required],
      taskPriorityId: [null, Validators.required],

      isManual: [true],
      isPrimary: [false],

      isVerificationRequired: [false],
      isStatusOnMailRequired: [false],
      isStatusOnMailDaily: [false],
      isStatusOnMailWeekly: [false],
      isStatusOnMailMonthly: [false],

      defaultFrequencyTypeId: [null, Validators.required],
      defaultDay: [1],
      defaultMonth: [1],

      verifiedById: [null],
      assignedToId: [null],
      reportedToId: [null],

      verifiedByName: [null],
      assignedToName: [null],
      reportedToName: [null]
    });
  }

  get formVerifiedById(){ return this.customForm.get('verifiedById'); }
  get formAssignedToId(){ return this.customForm.get('assignedToId'); }
  get formReportedToId(){ return this.customForm.get('reportedToId'); }

  get formVerifiedBy(){ return this.customForm.get('verifiedByName'); }
  get formAssignedTo(){ return this.customForm.get('assignedToName'); }
  get formReportedTo(){ return this.customForm.get('reportedToName'); }

  get formTaskPriorityId() { return <FormGroup>this.customForm.get('taskPriorityId'); }
  updateTaskPriorityId(val){ this.formTaskPriorityId.setValue(val); }

  get formOrgProcessId() { return <FormGroup>this.customForm.get('orgProcessId'); }
  updateOrgProcessId(val){ this.formOrgProcessId.setValue(val); }

  get formFrequencyTypeId() { return <FormGroup>this.customForm.get('defaultFrequencyTypeId'); }
  updateFrequencyTypeId(val){ this.formFrequencyTypeId.setValue(val); }

  updateVerifiedById(val: any){
    const { id, orgUserId, userId, name} = val || {};
    this.formVerifiedById.setValue(userId, { emitEvent: false});
    this.formVerifiedBy.setValue(name, { emitEvent: false});
  }
  updateAssignedToId(val){
    const { id, orgUserId, userId, name} = val || {};
    this.formAssignedToId.setValue(userId, { emitEvent: false});
    this.formAssignedTo.setValue(name, { emitEvent: false});
  }
  updateReportedToId(val){
    const { id, orgUserId, userId, name} = val || {};
    this.formReportedToId.setValue(userId, { emitEvent: false});
    this.formReportedTo.setValue(name, { emitEvent: false});
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  populateOrgTask(item: OrgTask){
    // if(!item.orgParentProcessId){
    //     item.orgParentProcessId = item.orgProcessId
    // }
    this.customForm.patchValue(item);
  }
}
@Component({
  standalone: false,
  selector: 'org-task-ce',
  templateUrl: './templates/task-ce.html',
  styles: [`:host{ display: contents; }`]
})
export class TaskCeComponent extends OrgTaskForm implements OnInit, OnDestroy {
  onOk: EventEmitter<any> = new EventEmitter<any>();
  onCancel: EventEmitter<any> = new EventEmitter<any>();
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Input() id: any;
  @Input() processId: number;
  @Input() processList: Array<any> =  [];
  lookup: WorkflowPluginLookup;
  submitted: boolean = false;
  subscriber: Subscription;
  isLoading: boolean;
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  constructor(public override fb: FormBuilder,
              public lookupResolver: OrgWorkflowAPIResolver,
              private service: OrgTaskService) {
    super(fb);
    this.lookup = lookupResolver.masterType;
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
      } else {
        const frequency = this.lookup.defaultFrequency();
        const priority = this.lookup.defaultTaskPriority();

        this.populateOrgTask(<any>{
          defaultFrequencyTypeId: frequency?.id,
          taskPriorityId: priority?.id,
          orgProcessId: this.processId,
          isActive: true
        });
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
