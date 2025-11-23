import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgProcessService} from "../services/org-process.service";
import {Subscription} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {OrgProcess} from "../domains/org-process.serializer";
class OrgProcessForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      id:[null],
      name: ['', Validators.required],
      description: [null, Validators.required],
      parentId: [null],
      inchargeId: [null],
      sortOrder: [null],
      // proessPhase: [null],
      // proessPhaseOn: [null],
      // manualStatus: [null],
      // manualStatusOn: [null],
      inchargeName: [null],
      phases: this.fb.array([]),
      isActive: [true],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
  get formInchargeId(){ return this.customForm.get('inchargeId'); }
  get formInchargeName(){ return this.customForm.get('inchargeName'); }
  updateInchargeId(val: any){
    const { id, name, userId } = val || {};
    this.formInchargeId.setValue(userId, { emitEvent: false});
    this.formInchargeName.setValue(name, { emitEvent: false});
  }
  populateOrgProcess(item: OrgProcess){
    this.customForm.patchValue(item);
    // Reset existing phases
    this.phases.clear();
    (item.phases || []).map(r => this.addPhase(r));
    // Fill the top-level fields
    this.customForm.patchValue({
      id: item.id,
      name: item.name,
      description: item.description,
      parentId: item.parentId,
      inchargeId: item.inchargeId,
      inchargeName: item.inchargeName,
      sortOrder: item.sortOrder,
      isActive: item.isActive
    });
  }
  // --- Phase Helpers ---
  get phases(): FormArray { return this.customForm.get('phases') as FormArray; }
  steps(phaseIndex: number) { return this.phases.at(phaseIndex).get('approvalSteps') as FormArray<FormGroup>; }
  addPhase(data: any): void {
    data = data || { sortOrder: this.phases.length + 1, isActive: true };
    const phase = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
      color: [data.color || ''],
      phaseStatusId: [data.phaseStatusId],
      sortOrder: [data.sortOrder],
      isDefault: [data.isDefault],
      isActive: [ data.isActive ],
      approvalSteps: this.fb.array([])
    });
    this.phases.push(phase);
    // Populate steps
    (data.approvalSteps || []).forEach((s: any, phaseIndex: number) => { this.addStep(s, phaseIndex); });
  }

  addStep(s: any, phaseIndex: number) {
    s = s || { stepOrder: this.steps(phaseIndex).length + 1, isActive: true };
    const step = this.fb.group({
      id: [s.id],
      stepOrder: [s.stepOrder],
      approverRole: [s.approverRole],
      isActive: [s.isActive],
      rules: this.fb.array([])
    });
    this.steps(phaseIndex).push(step);
    // Populate rules
    (s.rules || []).forEach((r: any, stepIndex: number) => { this.addRule(r, phaseIndex, stepIndex); });
  }
  addRule(r, phaseIndex: number, stepIndex: number) {
    r = r || {};
    const rule = this.fb.group({
      id: [r.id],
      propertyName: [r.propertyName, Validators.required],
      operator: [r.operator],
      value: [r.value],
      isActive: [r.isActive]
    });
    this.rules(phaseIndex, stepIndex).push(rule);
  }
  rules(phaseIndex: number, stepIndex: number) { return this.steps(phaseIndex).at(stepIndex).get('rules') as FormArray<FormGroup>; }
  removePhase(index: number) { this.phases.removeAt(index); }
  // --- Step Helpers ---
  removeStep(phaseIndex: number, stepIndex: number) { this.steps(phaseIndex).removeAt(stepIndex); }
  // --- Rule Helpers ---
  removeRule(phaseIndex: number, stepIndex: number, ruleIndex: number) { this.rules(phaseIndex, stepIndex).removeAt(ruleIndex); }
}
@Component({
  standalone: false,
  templateUrl: './templates/process-ce.html',
  styleUrl: `./process.css`
})
export class ProcessCeView extends OrgProcessForm implements OnInit, OnDestroy {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  //@ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
  get actionType(){ return this.id ? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Input() parentId: number | string;
  @Input() id: any;
  submitted: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  subscribe: Subscription;
  isLoading: boolean = false;
  constructor(public override fb: FormBuilder, private service: OrgProcessService) { super(fb); }
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
    if (form.invalid) { return; }
    const success = (resp)=> {
      this.submitted = false;
      this.onOk.emit(resp);
    };
    const error = (resp)=> { this.submitted = false; };
    const formData = form.getRawValue();
    formData.parentId = this.parentId;
    this.submitted = true;
    if(this.id) {
      this.service.update(this.id, formData).subscribe(success, error);
    } else {
      this.service.create(formData).subscribe(success, error);
    }
  }
  ngOnDestroy(){ this.subscribe?.unsubscribe(); }
}
