import {Component, Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {pairwise, startWith, distinctUntilChanged} from "rxjs";
import {DAYS, DEPOSIT_DURATION_TYPE, MONTHS, WEEK_DAYS, WEEK_OF} from "../../../enums";
import {SchedulerTask, SchedulerTaskParam} from "../domains/schedular.domain";
import {SchedulerService} from "../services/scheduler.service";
import {EventFrequencyTypeLookup, OrgWorkflowAPIResolver} from "../../../services";
@Component({
    standalone: false,
    selector: 'frequency-type-ce',
    templateUrl: './templates/frequency-type-ce.html',
    styles: [`:host{ display: contents; }`]
})
export class FrequencyTypeComponent implements OnInit
{
  customForm: FormGroup;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  frequencyTypes: EventFrequencyTypeLookup[] = [];
  frequency: EventFrequencyTypeLookup;
    tasks: Array<SchedulerTask> = [];

    depositDurationTypes: Array<any> = DEPOSIT_DURATION_TYPE;
    weekDays: Array<any> = WEEK_DAYS;
    months: Array<any> = MONTHS;
    days: Array<any> = DAYS;
    weeksOf: Array<any> = WEEK_OF;
  constructor(public fb: FormBuilder, public lookupLookup: OrgWorkflowAPIResolver, private service: SchedulerService) {
      this.customForm = this.fb.group({
          frequencyTypeId: [null, Validators.required],
          orgTaskId: [null],
          defaultDay: [null],
          defaultMonth: [null],
          depositDurationType: [null]
      });
      const lookup = this.lookupLookup.masterType;
      this.frequencyTypes = lookup.getFeeFrequencies();
  }

  get formFrequencyTypeId() { return <FormGroup>this.customForm.get('frequencyTypeId'); }
  populateInfo(frequencyTypeId) {
      this.frequency = (this.frequencyTypes || []).find(r => r.id == frequencyTypeId);
      if(this.frequency.isOnEvent) {
          this.populateTasks();
      }
  }

    populateData(data) {
        this.customForm.patchValue({
            frequencyTypeId: data.frequencyTypeId,
            orgTaskId: data.orgTaskId,
            defaultDay: data.defaultDay,
            defaultMonth: data.defaultMonth,
            depositDurationType: data.depositDurationType,
        }, {emitEvent: false});
        if(data.frequencyTypeId) {
            this.populateInfo(data.frequencyTypeId);
        }
    }

  ngOnInit(){
      const itemFormValueChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next)
          {
              if(prev?.frequencyTypeId != next?.frequencyTypeId)
              {
                  this.populateInfo(next.frequencyTypeId);
              }
              this.onOk.emit(next);
          }
      };
      this.customForm.valueChanges
          .pipe(
              startWith(null as any),
              pairwise(),
              distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
          )
          .subscribe(itemFormValueChange);
  }

    populateTasks(){
      if(!this.tasks.length) {
          const success = (data)=>{
              this.tasks = (data || []).map(r => new SchedulerTask(r));
          };
          const failure = (data)=>{ this.tasks = []; };
          const taskParam: SchedulerTaskParam = new SchedulerTaskParam();
          taskParam.showFeePLanTasks = true;
          this.service.getOrgTaskEvents(taskParam).subscribe(success, failure);
      }
    }

    // feeTypeChangeImpactDialogue(accept, refused){
    //   const message = `Tax implication in Fee Structure will Change Automatically. Do you want to update student's existing fee record of current session`;
    //   this.coreService.alertService.showDialog(message, DialogType.confirm, accept, refused);
    // }
    //   this.feeTypeChangeImpactDialogue((data)=>{
    //     this.formTaxMapperId.setValue(taxMapperId);
    //     this.formTaxCategoryId.setValue(taxCategory.id);
    //     this.applyRateChanges(this.amount, this.feeTypeId, studyLevelId, studyModeId, taxMapperId, taxCategory.id);
    //     this.service.updateDueFeeStructure(this.feeTypeId, 0, this.formFeeStructureId.value).subscribe(r => {}, err=> {})
    //   }, (e)=> {
    //     this.formTaxMapperId.setValue(this.formTaxMapperId.parent.value.taxCategoryId);
    //     this.formTaxCategoryId.setValue(this.formTaxMapperId.parent.value.taxMapperId);
    //   });
    // }
}
