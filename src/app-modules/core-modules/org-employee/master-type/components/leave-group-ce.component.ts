import {Component, EventEmitter, Injectable, Input, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {DutyMasterService} from "../services";

@Injectable()
class RuleFormFactory {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: [null, Validators.required],
            rules: this.fb.array([])
        });
    }

    getRuleForm(data){
        return this.fb.group({
            id: [data.id],
            employeeGradeId: [data.employeeGradeId, Validators.required],
            employeeGrade: [{value: data.employeeGrade, disabled:true}],
            constraintTypeId: [data.constraintTypeId],
            value: [data.value],
            status: [data.status]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formRules() { return <FormArray>this.customForm.get('rules'); }

    addToFormRule(item){ this.formRules.push(this.getRuleForm(item)); }

    populateForm(data){

        this.customForm.get('name').setValue(data?.name);
        this.formRules.controls.length = 0;
        (data.rules || []).map(r => {
            this.addToFormRule({
                id: r.id,
                leaveGroupId: r.leaveGroupId,
                leaveTypeId: r.leaveTypeId,
                allowedLeave: r.allowedLeave,
                status: r.status || null
            });
        });
    }
}

@Component({
  standalone: false,
  templateUrl: './templates/duty-ce.html'
})
export class LeaveGroupCeComponent extends RuleFormFactory {
  get actionType(){ return this.id? ACTION_ENUM.UPDATE : ACTION_ENUM.ADD; };
  @Input() id: any;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  @Input() set data(info) {

  };

  submitted: boolean = false;
  constructor(public fb: FormBuilder, public service: DutyMasterService) { super(fb); }

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    if(this.actionType == ACTION_ENUM.UPDATE && this.id) {
      this.service.update(this.id, form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.service.create(form.value).subscribe((resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
      });
    }
  }
}
