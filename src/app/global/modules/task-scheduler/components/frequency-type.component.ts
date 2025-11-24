import {
    Component,
    Directive,
    EventEmitter,
    Injector,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {pairwise, startWith, distinctUntilChanged} from "rxjs";
import {DAYS, FREQUENCY_TYPE, MONTHS, WEEK_DAYS, WEEK_OF} from "../../../enums";
import {SchedulerTask, SchedulerTaskParam} from "../domains/schedular.domain";
import {SchedulerService} from "../services/scheduler.service";
import {EventFrequencyTypeLookup, OrgWorkflowAPIResolver, WorkflowPluginLookup} from "../../../services";

@Directive()
class FrequencyCEComponent
{
    processMasterType: string;
    customForm: FormGroup;
    frequencyTypes: EventFrequencyTypeLookup[] = [];
    frequency: EventFrequencyTypeLookup;
    tasks: Array<SchedulerTask> = [];
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    frequencyOptions: Array<any> = [
        { name: 'Every Month', id: 1, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'Bi Monthly', id: 2, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'Quarterly', id: 3, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'Semester Wise', id: 6, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'One Time', id: 12, masterType: FREQUENCY_TYPE.MONTHLY }
    ];
    weekDays: Array<any> = WEEK_DAYS;
    months: Array<any> = MONTHS;
    days: Array<any> = DAYS;
    weeksOf: Array<any> = WEEK_OF;

    protected lookupService: OrgWorkflowAPIResolver;
    protected service: SchedulerService;
    protected lookup: WorkflowPluginLookup;
    constructor(public fb: FormBuilder, public injector: Injector) {
        this.customForm = this.fb.group({
            frequencyTypeId: [null, Validators.required],
            orgTaskId: [null],
            defaultDay: [null],
            defaultMonth: [null],
            depositDurationType: [null],

            frequency: ['monthly', Validators.required],
            dueDate: ['1', Validators.required],
            dueMonth: ['1-12', Validators.required],
            yearMode: ['CalendarYear', Validators.required],
            customStartMonth: [null]
        });

        this.service = injector.get(SchedulerService);
        this.lookupService = injector.get(OrgWorkflowAPIResolver);
        this.lookup = this.lookupService.masterType;

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
    populateTasks(){
        if(!this.tasks.length) {
            const success = (data)=>{
                this.tasks = (data || []).map(r => new SchedulerTask(r));
            };
            const failure = (data)=>{ this.tasks = []; };
            const taskParam: SchedulerTaskParam = new SchedulerTaskParam();
            taskParam.processMasterType = this.processMasterType;
            this.service.getOrgTaskScheduleLookup(taskParam).subscribe(success, failure);
        }
    }
}
@Component({
    standalone: false,
    selector: 'frequency-type-ce',
    templateUrl: './templates/frequency-type-ce.html',
    styles: [`:host{ display: contents; }`],
    providers: [SchedulerService]
})
export class FeeFrequencyComponent extends FrequencyCEComponent implements OnInit
{
  override processMasterType = 'EDUCATION';
  constructor(public override fb: FormBuilder, public override injector: Injector) {
      super(fb, injector);
      this.frequencyTypes = this.lookup.getFeeFrequencies();
  }
  ngOnInit(){}

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


