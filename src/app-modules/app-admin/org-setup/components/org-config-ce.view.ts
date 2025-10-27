import {Component, Input, OnInit} from '@angular/core';
import {OrgSetupAPIResolver} from "../services/api.resolver";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgSettingService} from "../services/org-setting.service";
import { AppSetup, AppSetupService } from "@app-global";

class OrgConfigInfoForm {
    submitted: boolean = false;
    customForm: FormGroup;

    weekDays: Array<any> = [
        {id: 1, name: 'Monday'},
        {id: 2, name: 'Tuesday'},
        {id: 3, name: 'Wednesday'},
        {id: 4, name: 'Thursday'},
        {id: 5, name: 'Friday'},
        {id: 6, name: 'Saturday'},
        {id: 7, name: 'Sunday'}
    ];
    months: Array<any> = [
        { name: 'Jan', id:1, checked: true},
        { name: 'Feb', id:2, checked: false},
        { name: 'Mar', id:3, checked: false},
        { name: 'Apr', id:4, checked: false},
        { name: 'May', id:5, checked: false},
        { name: 'Jun', id:6, checked: false},
        { name: 'Jul', id:7, checked: false},
        { name: 'Aug', id:8, checked: false},
        { name: 'Sep', id:9, checked: false},
        { name: 'Oct', id:10, checked: false},
        { name: 'Nov', id:11, checked: false},
        { name: 'Dec', id:12, checked: false}
    ];

    dateFormatList: Array<any> = [
        {id: 'dd MMM yyyy', name: 'dd MM yyyy Like 16 Feb 2022'},
        {id: 'MM dd yyyy', name: 'MM dd yyyy Like 02/16/2022'},
        {id: 'M d yy', name: 'M d yy Like 2/16/22'},
        {id: 'MMM d, y', name: 'MMM d, y Like Jun 15, 2015'},
        {id: 'd MMM, y', name: 'd MMM, y Like 15 Jun, 2015'}
    ];
    dateSeparatorList: Array<any> = [
        {id: '', name: ''},
        {id: '/', name: '/'},
        {id: '.', name: '.'},
        {id: '-', name: '-'}
    ];

    defaultLanguage: any;
    defaultCurrency: any;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            startWeekDay: [null],

            //startDate: [fromDate, Validators.required],
            ofcStartTime: [null],
            ofcEndTime: [null],

            languageId: [null, Validators.required],
            currencyId: [null, Validators.required],

            fyStartDay: [null],
            fyStartMonth: [null],
            fyCloseDay: [null],
            fyCloseMonth: [null],

            dateFormat: [null],
            dateSeparator: [null],
            timeZone: [null, Validators.required],

            dateFormater: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formLanguageId() { return <FormGroup>this.customForm.get('languageId'); }
    get formCurrencyId() { return <FormGroup>this.customForm.get('currencyId'); }
    get formWeekDayId() { return <FormGroup>this.customForm.get('startWeekDay'); }
    get formDateFormat() { return <FormGroup>this.customForm.get('dateFormat'); }
    get formDateSeperator() { return <FormGroup>this.customForm.get('dateSeparator'); }
    get formTimeZone() { return <FormGroup>this.customForm.get('timeZone'); }
    get formDateFormater() { return <FormGroup>this.customForm.get('dateFormater'); }

    updateLanguageId(val){ this.formLanguageId.setValue(val); }
    updateCurrencyId(val){ this.formCurrencyId.setValue(val); }
    updateWeekDayId(val){ this.formWeekDayId.setValue(val); }
    updateDateFormat(val){ this.formDateFormat.setValue(val); }
    updateDateSeperator(val){ this.formDateSeperator.setValue(val); }
    updateTimeZone(val){ this.formTimeZone.setValue(val); }

    get formatInfo(){
        const formate = this.formDateFormat.value;
        return (formate || '').replace(/\s/g, this.formDateSeperator.value);
    }

    onDateFormatChange(e) {
        const sp = (e || '').split(':');
        this.formDateFormat.setValue(sp[0]);
        this.formDateSeperator.setValue(sp[1]);
    }
}
@Component({
    selector: 'org-config',
    templateUrl: './templates/org-config-ce.html'
})
export class OrgConfigView extends OrgConfigInfoForm implements OnInit{
    orgSetup: AppSetup;
    constructor(public fb: FormBuilder,
                public apiResolver: OrgSetupAPIResolver,
                public service: OrgSettingService,
                public appSetupService: AppSetupService
                ){
        super(fb);
        this.orgSetup = appSetupService.orgSetup;
    }

    /*itemFormLanguageValueChange = ([prev, next]: [any, any]) =>
    {
        if(prev != next)
        {
            this.defaultLanguage = this.apiResolver.masterType.getLanguageById(next);
        }
    };

    itemFormCurrencyValueChange = ([prev, next]: [any, any]) =>
    {
        if(prev != next)
        {
            this.defaultCurrency = this.apiResolver.masterType.getCurrencyById(next);

        }
    };*/

    // convenience getter for easy access to form fields
    get fo() { return this.customForm.controls; }

    ngOnInit() {
        //this.orgSetup = this.coreService.orgSetup;
        const { orgConfig } = this.orgSetup;

        this.customForm.patchValue(<any>orgConfig);
        this.formLanguageId.disable();
        this.formCurrencyId.disable();
        // this.formLanguageId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(this.itemFormLanguageValueChange);
        // this.formCurrencyId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(this.itemFormCurrencyValueChange);
    }

    educationalFeatures = [
        { name: 'Study Modes', sortOrder: 1,
            features: [
                { formKey:'hasMultipleStudyMode', name: 'Multiple Study Mode', desc: '', sortOrder: 1, type: 'checkbox', value: false },
                { formKey:'hasMultipleClassSection', name: 'Multiple Class Section', desc: '', sortOrder: 2, type: 'checkbox', value: false },
                { formKey:'hasMultipleCourseSection', name: 'Multiple Course Section', desc: '', sortOrder: 2, type: 'checkbox', value: false }
            ]
        }
    ];
    otherFeatures = [
        { name: 'Config', sortOrder: 1,
            features: [
                { formKey:'hasMultipleBranch', name: 'Multiple Org Branches', desc: '', sortOrder: 2, type: 'checkbox', value: false },
                { formKey:'passwordChangeOnFirstLoginEnabled', name: 'Password Change On First Login', desc: '', sortOrder: 2, type: 'checkbox', value: false },
                { formKey:'hasMultiLanguage', name: 'Multiple Language', desc: '', sortOrder: 2, type: 'checkbox', value: false },
                { formKey:'hasMultiCurrency', name: 'Multiple Currency', desc: '', sortOrder: 2, type: 'checkbox', value: false }
            ]
        }
    ];
    projectFeatures = [
        { name: 'Project & WorkFlow', sortOrder: 1,
            features: [
                { formKey:'hasMultiProjectModule', name: 'Enable Multiple Project Module', desc: '', sortOrder: 1, type: 'checkbox', value: false },
                { formKey:'hasProjectWorkFlow', name: 'Enable Project WorkFlow', desc: '', sortOrder: 2, type: 'checkbox', value: false }
            ]
        }
    ];

    onSubmit(form) {
        if (form.invalid) { return; } // stop here if form is invalid

        this.submitted = true;
        const success = (resp: any)=> { this.submitted = false; };
        const error = (resp: any)=> { this.submitted = false; };

        const data: any = form.getRawValue();
        this.service.updateUnitConfigSetup(data?.id, data).subscribe(success, error);
    }
}
