import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OrgSetupAPIResolver} from "../services/api.resolver";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {pairwise, startWith} from "rxjs";
import {OrgSettingService} from "../services/org-setting.service";
import {ConfigLookup} from "../domains/lookup.serializer";
import {AppSetupService} from "../../../app/global/services";
import {AppSetup} from "../../../app/global/services/models";
class OrgConfigInfoForm {
    customForm: FormGroup;
    submitted: boolean = false;
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
}
@Component({
    standalone: false,
    selector: 'org-config',
    templateUrl: './templates/org-config.html',
    providers: [OrgSettingService]
})
export class OrgConfigView extends OrgConfigInfoForm implements OnInit{
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
    orgSetup: AppSetup;
    orgLookup: ConfigLookup;
    constructor(public override fb: FormBuilder, public apiResolver: OrgSetupAPIResolver,
                public coreService: AppSetupService, public service: OrgSettingService){
        super(fb);
        this.orgSetup = this.coreService.appSetup;
        this.orgLookup = this.apiResolver.masterType;
        const itemFormLanguageValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.defaultLanguage = this.orgLookup.getLanguageById(next);
            }
        };

        const itemFormCurrencyValueChange = ([prev, next]: [any, any]) =>
        {
            if(prev != next)
            {
                this.defaultCurrency = this.orgLookup.getCurrencyById(next);
            }
        };
        this.formLanguageId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormLanguageValueChange);
        this.formCurrencyId.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemFormCurrencyValueChange);
    }

    get hasValidConfig (){ return (this.orgLookup?.hasValidOrgSetup() && this.orgSetup.orgConfig?.hasValidConfig()); }

    ngOnInit() {
        const { orgConfig, options } = this.orgSetup;
        this.customForm.patchValue(<any>orgConfig);
    }

    onSubmit(form: FormGroup) {
        if (form.invalid) { return; } // stop here if form is invalid
        this.submitted = true;
        const success = (resp: any)=> { this.submitted = false; };
        const error = (resp: any)=> { this.submitted = false; };
        const data: any = form.getRawValue();
        this.service.updateUnitConfigSetup(data?.id, data).subscribe(success, error);
        this.service.orgSettingEndpoint(data?.id, data).toPromise().then(success, error);
    }

    // onSubmit(formData) {
    //     if (formData.invalid) {
    //         return;
    //     }
    //     this.submitted = true;
    //
    //     const data = formData.getRawValue();
    //     const success = (resp: any) => {
    //         this.submitted = false;
    //         data.currencyInfo = {
    //             currencyId: data.currencyId,
    //             name: this.defaultCurrency.name,
    //             currencyCode: this.defaultCurrency.currencyCode,
    //             symbol: this.defaultCurrency.symbol,
    //         };
    //         data.languageInfo = {
    //             languageId: data.languageId,
    //             name:this.defaultLanguage.name,
    //             cultureCode:this.defaultLanguage.cultureCode,
    //         };
    //
    //         this.service.updateOrgConfigSettings(data).toPromise().then((r)=>{}, (r)=>{});
    //     };
    //     const error = (resp: any) => { this.submitted = false; };
    //     // const { orgSettingId } = this.orgService.org;
    //     // this.service.update(orgSettingId, data).subscribe(success, error);
    // }
}
