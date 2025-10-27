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
            dutyConstraintRule: this.fb.array([])
        });
    }

    getDutyConstraintRuleFormGroup(data){
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

    get formDutyConstraintRule() {
        return <FormArray>this.customForm.get('dutyConstraintRule');
    }

    addToFormRule(item){
        this.formDutyConstraintRule.push(this.getDutyConstraintRuleFormGroup(item));
    }

    mergeUpdate(grades, rules, row){
        this.customForm.get('name').setValue(row.name);
        this.formDutyConstraintRule.controls.length = 0;

        const rowInfo = (rules || []).reduce((prev, curr) => {
            prev[curr.employeeGradeId] = curr;
            return prev;
        }, {});

        (grades || []).map(r => {
            const rowItem = rowInfo[r.id] || {};
            const item = {
                id: rowItem.id || null,
                constraintTypeId: rowItem.constraintTypeId || null,
                value: rowItem.value || '',
                status: rowItem.status || null,
                employeeGradeId: r.id,
                employeeGrade: r.name
            };
            this.addToFormRule(item);
        });
    }
}

@Component({
  standalone: false,
  templateUrl: './templates/duty-ce.html'
})
export class DutyCeComponent extends RuleFormFactory {
  @Input() actionType: string;
  @Input() id: any;

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  @Input() set data(info) {

    if(!info){
      this.formRuleItem.controls.length = 0;
      return;
    }

    const {otherData, row } = info;
    const { dutyConstraintRule } = row || { dutyConstraintRule: []};
    this.grades = otherData.grades;
    this.mergeUpdate(otherData.grades || [], dutyConstraintRule || [], info.row || {});
  };

  submitted: boolean = false;
  grades: Array<any>;

  constructor(public override fb: FormBuilder, public service: DutyMasterService) { super(fb); }

  get formRuleItem(): FormArray{
    return <FormArray>this.customForm.get('dutyConstraintRule');
  }

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
