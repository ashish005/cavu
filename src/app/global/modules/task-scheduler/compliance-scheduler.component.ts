import {Component, Directive, EventEmitter, Injector, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    FREQUENCY_TYPE,
    YEAR_MODE_ENUM,
    FrequencyExtender
} from "../../enums";
import {OrgConfigOptions} from "../../services/models";
import {AppSetupService} from "../../services";
import {ShortScheduler} from "./domains/short-scheduler.domain";


@Component({
    standalone: false,
    selector: 'compliance-frequency-ce',
    templateUrl: './templates/compliance-scheduler.html',
    styles: [`:host{ display: contents; }`]
})
export class ComplianceFrequencyComponent extends FrequencyExtender implements OnInit
{
    frequencyTypes: any[] = [
        { "name": "One Time", "masterType": FREQUENCY_TYPE.FIXED_TIME, "isFeeType": true, "isPeriodType": true },
        // { "name": "Daily", "masterType": FREQUENCY_TYPE.DAILY, "isFeeType": false, "isPeriodType": true },
        // { "name": "Weekly", "masterType": FREQUENCY_TYPE.WEEKLY, "isFeeType": false, "isPeriodType": true },
        { "name": "Monthly", "masterType": FREQUENCY_TYPE.MONTHLY, "isFeeType": true, "isPeriodType": true },
        //{ "name": "On Event", "masterType": FREQUENCY_TYPE.ON_EVENT, "isFeeType": false, "isPeriodType": true }
    ];
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
    get f() { return this.customForm.controls; }
    ngOnInit(){}

    applySchedular(data: ShortScheduler){
        const { fyStartDay, fyStartMonth, timeZone} = this.orgConfig;
        const { yearMode, frequencyMasterType, hasNoExpiration, monthInterval, dayNo, monthNo } = data || {};

        //const dayNoInt = dayNo != null ? parseInt(dayNo, 10) : null;

        this.customForm.get('yearMode').setValue(yearMode || YEAR_MODE_ENUM.FINANCIAL_YEAR);
        this.customForm.get('timeZone').setValue(timeZone);
        this.customForm.get('fyStartDay').setValue(fyStartDay);
        this.customForm.get('fyStartMonth').setValue(fyStartMonth);
        this.customForm.get('frequencyMasterType').setValue(frequencyMasterType || FREQUENCY_TYPE.MONTHLY);
        this.customForm.get('hasNoExpiration').setValue(hasNoExpiration);
        this.customForm.get('monthInterval').setValue(monthInterval);
        this.customForm.get('dayNo').setValue(dayNo || fyStartDay);
        this.customForm.get('monthNo').setValue(monthNo || fyStartMonth);
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