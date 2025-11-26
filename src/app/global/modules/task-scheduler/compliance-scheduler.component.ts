import {Component, Directive, EventEmitter, Injector, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DAYS, FREQUENCY_TYPE, MONTHS, WEEK_DAYS, WEEK_OF, YEAR_MODES, YEAR_MODE_ENUM} from "../../enums";
import {OrgConfigOptions} from "../../services/models";
import {AppSetupService} from "../../services";
import {pairwise, startWith} from "rxjs";
class FrequencyCEComponent
{
    freqEnum = FREQUENCY_TYPE;
    frequencyTypes: any[] = [
        { "name": "One Time", "masterType": FREQUENCY_TYPE.FIXED_TIME, "isFeeType": true, "isPeriodType": true },
        // { "name": "Daily", "masterType": FREQUENCY_TYPE.DAILY, "isFeeType": false, "isPeriodType": true },
        // { "name": "Weekly", "masterType": FREQUENCY_TYPE.WEEKLY, "isFeeType": false, "isPeriodType": true },
        { "name": "Monthly", "masterType": FREQUENCY_TYPE.MONTHLY, "isFeeType": true, "isPeriodType": true },
        //{ "name": "On Event", "masterType": FREQUENCY_TYPE.ON_EVENT, "isFeeType": false, "isPeriodType": true }
    ];
    frequencyOptions: Array<any> = [
        { name: 'Every Month', id: 1, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'Bi Monthly', id: 2, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'Quarterly', id: 3, masterType: FREQUENCY_TYPE.MONTHLY },
        { name: 'Half-Yearly', id: 6, masterType: FREQUENCY_TYPE.MONTHLY }
    ];
    weekDays: Array<any> = WEEK_DAYS;
    months: Array<any> = MONTHS;
    days: Array<any> = DAYS;
    weeksOf: Array<any> = WEEK_OF;
    yearModes = YEAR_MODES;
}
@Component({
    standalone: false,
    selector: 'compliance-frequency-ce',
    templateUrl: './templates/compliance-scheduler.html',
    styles: [`:host{ display: contents; }`]
})
export class ComplianceFrequencyComponent extends FrequencyCEComponent implements OnInit
{
    @Output() onFrequencyChange: EventEmitter<any> = new EventEmitter<any>();
    customForm: FormGroup;
    orgConfig: OrgConfigOptions;
    constructor(public fb: FormBuilder, public setupService: AppSetupService) {
        super();
        this.orgConfig = this.setupService.appSetup.orgConfig;
        this.customForm = this.fb.group({
            orgTaskId: [null],
            yearMode: [null, Validators.required],
            financialStartMonth: [ null ],
            frequencyMasterType: [ null, Validators.required],
            hasNoExpiration: [false],

            defaultDay: [null],
            defaultMonth: [null],
            //monthly
            monthInterval: [null],
            dayNo: [null]
        });
    }
    get f() { return this.customForm.controls; }
    ngOnInit(){
        const { fyStartDay, fyStartMonth} = this.orgConfig;
        this.customForm.patchValue({
            yearMode: YEAR_MODE_ENUM.FINANCIAL_YEAR,
            fyStartMonth: fyStartMonth,
            frequencyMasterType: FREQUENCY_TYPE.MONTHLY,
            hasNoExpiration: true,
            defaultDay: fyStartDay,
            defaultMonth: fyStartMonth,
            monthInterval: 3,
            dayNo: fyStartDay
        });
        // const onFormValueChange = ([prev, next]: [any, any]) => {
        //     if(prev != next) {
        //         this.onFrequencyChange.emit(next);
        //     }
        // };
        // this.customForm.valueChanges.pipe(startWith(null), pairwise()).subscribe(onFormValueChange);
    }

    reviewScheduler(){
        this.onFrequencyChange.emit(this.customForm.getRawValue());
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