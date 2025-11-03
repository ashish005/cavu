import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OrgSetupAPIResolver} from "../../services/api.resolver";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgSettingService} from "../../services/org-setting.service";
import { AppSetup, AppSetupService } from "@app-global";
import {ConfigLookup} from "../../domains/lookup.serializer";

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
        {id: 'dd MMM yyyy', name: 'dd MM yyyy', ex: '16 Feb 2022'},
        {id: 'MM dd yyyy', name: 'MM dd yyyy', ex: '02 16 2022'},
        {id: 'M d yy', name: 'M d yy', ex: '2 16 22'},
        {id: 'MMM d, y', name: 'MMM d, y', ex: 'Jun 15, 2015'},
        {id: 'd MMM, y', name: 'd MMM, y', ex: '15 Jun, 2015'}
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
            countryId: [null, Validators.required],

            fyStartDay: [null],
            fyStartMonth: [null],
            fyCloseDay: [null],
            fyCloseMonth: [null],

            dateFormat: [null],
            dateSeparator: [null],
            timeZone: [null, Validators.required]
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
    get formCountryId() { return <FormGroup>this.customForm.get('countryId'); }

    updateLanguageId(val){ this.formLanguageId.setValue(val); }
    updateCurrencyId(val){ this.formCurrencyId.setValue(val); }
    updateWeekDayId(val){ this.formWeekDayId.setValue(val); }
    updateDateFormat(val){ this.formDateFormat.setValue(val); }
    updateDateSeperator(val){ this.formDateSeperator.setValue(val); }
    updateTimeZone(val){ this.formTimeZone.setValue(val); }
    updateCountryId(val){ this.formCountryId.setValue(val); }

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
    standalone: false,
    templateUrl: './templates/org-office-info.html'
})
export class OrgOfficeInfoView extends OrgConfigInfoForm implements OnInit{
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    orgSetup: AppSetup;
    lookup: ConfigLookup;
    constructor(public override fb: FormBuilder,
                public apiResolver: OrgSetupAPIResolver,
                public service: OrgSettingService,
                public appSetupService: AppSetupService
                ){
        super(fb);
        this.orgSetup = appSetupService.appSetup;
        this.lookup = this.apiResolver.masterType;
    }
    ngOnInit() {
        //this.orgSetup = this.coreService.orgSetup;
        const { orgConfig } = this.orgSetup;
        this.customForm.patchValue(<any>orgConfig);
        this.formLanguageId.disable();
        this.formCurrencyId.disable();
        this.formCountryId.disable();
        this.formTimeZone.disable();
    }
    onSubmit(form) {
        if (form.invalid) { return; } // stop here if form is invalid

        this.submitted = true;
        const success = (resp: any)=> { this.submitted = false; };
        const error = (resp: any)=> { this.submitted = false; };

        const data: any = form.getRawValue();
        this.service.updateUnitConfigSetup(data?.id, data).subscribe(success, error);
    }
}
