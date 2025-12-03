import {Component, Directive, EventEmitter, Injector, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DAYS, FREQUENCY_TYPE, MONTHS, WEEK_DAYS, WEEK_OF, YEAR_MODES, YEAR_MODE_ENUM} from "../../enums";
import {OrgConfigOptions} from "../../services/models";
import {AppSetupService} from "../../services";

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
    yearModes = YEAR_MODES.filter(r => r.showInShortScheduler);
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
            yearMode: [null, Validators.required],
            timeZone: [null, Validators.required],
            fyStartDay: [ null, Validators.required],
            fyStartMonth: [ null, Validators.required],
            frequencyMasterType: [ null, Validators.required],
            hasNoExpiration: [false],

            // defaultDay: [null],
            // defaultMonth: [null],
            //monthly
            monthInterval: [null],
            dayNo: [null],
            monthNo: [null],
        });
    }
    get f() { return this.customForm.controls; }
    ngOnInit(){
        const { fyStartDay, fyStartMonth, timeZone} = this.orgConfig;
        this.customForm.patchValue({
            yearMode: YEAR_MODE_ENUM.FINANCIAL_YEAR,
            timeZone: timeZone,
            fyStartDay: fyStartDay,
            fyStartMonth: fyStartMonth,
            frequencyMasterType: FREQUENCY_TYPE.MONTHLY,
            hasNoExpiration: true,
            monthInterval: 3,
            dayNo: fyStartDay,
            monthNo: fyStartMonth
        });
    }

    applySchedular(data){
        const { fyStartDay, fyStartMonth, timeZone} = this.orgConfig;
        this.customForm.patchValue({
            yearMode: data?.yearMode || YEAR_MODE_ENUM.FINANCIAL_YEAR,
            timeZone: timeZone,
            fyStartDay: fyStartDay,
            fyStartMonth: fyStartMonth,
            frequencyMasterType: data?.frequencyMasterType || FREQUENCY_TYPE.MONTHLY,
            hasNoExpiration: true,
            monthInterval: 3,
            dayNo: data.dayNo || fyStartDay,
            monthNo: data.monthNo || fyStartMonth
        });
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