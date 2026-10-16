import {Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {OrgSetupAPIResolver} from "../services/api.resolver";
import {OrgSettingService, errorMessageOf} from "../services/org-setting.service";
import {ConfigLookup} from "../domains/lookup.serializer";
import {AlertService, AppSetup, AppSetupService, MessageSeverity} from "@app-global";
import {OrgWizardService} from "../services/org-wizard.service";

/** "9:5" | "09:05" | "09:05:00" -> "09:05:00" (the API binds these to TimeSpan). */
const toTimeSpan = (value: string | null, fallback: string): string => {
    const [h = '0', m = '0', s = '0'] = (value || fallback).split(':');
    return [h, m, s].map(v => v.padStart(2, '0').slice(0, 2)).join(':');
};

const officeHoursValidator = (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('ofcStartTime')?.value;
    const end = group.get('ofcEndTime')?.value;
    if (!start || !end) { return null; }
    return toTimeSpan(start, start) < toTimeSpan(end, end) ? null : {officeHours: true};
};

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
        { name: 'Jan', id:1 }, { name: 'Feb', id:2 }, { name: 'Mar', id:3 },
        { name: 'Apr', id:4 }, { name: 'May', id:5 }, { name: 'Jun', id:6 },
        { name: 'Jul', id:7 }, { name: 'Aug', id:8 }, { name: 'Sep', id:9 },
        { name: 'Oct', id:10 }, { name: 'Nov', id:11 }, { name: 'Dec', id:12 }
    ];

    dateFormatList: Array<any> = [
        {id: 'dd MMM yyyy', name: 'dd MMM yyyy (16 Feb 2022)'},
        {id: 'MM dd yyyy', name: 'MM dd yyyy (02 16 2022)'},
        {id: 'M d yy', name: 'M d yy (2 16 22)'},
        {id: 'MMM d, y', name: 'MMM d, y (Jun 15, 2015)'},
        {id: 'd MMM, y', name: 'd MMM, y (15 Jun, 2015)'}
    ];
    dateSeparatorList: Array<any> = [
        {id: ' ', name: 'Space'},
        {id: '/', name: '/'},
        {id: '.', name: '.'},
        {id: '-', name: '-'}
    ];

    defaultLanguage: any;
    defaultCurrency: any;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            id: [null],
            startWeekDay: [1, Validators.required],

            ofcStartTime: ['09:00', Validators.required],
            ofcEndTime: ['17:00', Validators.required],

            languageId: [null, Validators.required],
            currencyId: [null, Validators.required],

            fyStartDay: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
            fyStartMonth: [1, Validators.required],

            dateFormat: ['dd MMM yyyy', Validators.required],
            dateSeparator: [' '],
            timeZone: [null, Validators.required]
        }, {validators: officeHoursValidator});
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formLanguageId() { return <FormGroup>this.customForm.get('languageId'); }
    get formCurrencyId() { return <FormGroup>this.customForm.get('currencyId'); }
    get formDateFormat() { return <FormGroup>this.customForm.get('dateFormat'); }
    get formDateSeperator() { return <FormGroup>this.customForm.get('dateSeparator'); }
    get formTimeZone() { return <FormGroup>this.customForm.get('timeZone'); }

    updateLanguageId(val){ this.formLanguageId.setValue(val); }
    updateCurrencyId(val){ this.formCurrencyId.setValue(val); }
    updateDateFormat(val){ this.formDateFormat.setValue(val); }
    updateDateSeperator(val){ this.formDateSeperator.setValue(val); }
    updateTimeZone(val){ this.formTimeZone.setValue(val); }

    get formatInfo(){
        const format = this.formDateFormat.value || '';
        const separator = this.formDateSeperator.value ?? ' ';
        return format.replace(/\s/g, separator);
    }

    isInvalid(name: string): boolean {
        const control = this.customForm.get(name);
        return !!control && control.invalid && (control.touched || control.dirty);
    }
}

@Component({
    standalone: false,
    selector: 'org-config',
    templateUrl: './templates/org-config.html',
    styleUrls: ['./templates/wizard-steps.css'],
    providers: [OrgSettingService]
})
export class OrgConfigView extends OrgConfigInfoForm implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('pageTitleTemplate', { static: true }) public pageTitleTemplate: TemplateRef<any>;
    orgSetup: AppSetup;
    orgLookup: ConfigLookup;
    errorMessage: string | null = null;

    private destroyRef = inject(DestroyRef);

    constructor(public override fb: FormBuilder, public apiResolver: OrgSetupAPIResolver,
                public coreService: AppSetupService, public service: OrgSettingService,
                public wizardService: OrgWizardService, private alertService: AlertService,
                private route: ActivatedRoute) {
        super(fb);
        this.orgSetup = this.coreService.appSetup;
        this.orgLookup = this.apiResolver.masterType ?? new ConfigLookup();

        this.formLanguageId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(id => this.defaultLanguage = this.orgLookup.getLanguageById(id));
        this.formCurrencyId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(id => this.defaultCurrency = this.orgLookup.getCurrencyById(id));
    }

    get lookupError(): string | null { return this.apiResolver.loadError; }
    get hasLookups(): boolean { return this.orgLookup?.hasValidOrgSetup(); }

    ngOnInit() {
        const saved = this.wizardService.state.orgConfig;
        const {orgConfig} = this.orgSetup;
        this.customForm.patchValue(<any>{
            ...orgConfig,
            ofcStartTime: (orgConfig?.ofcStartTime || '09:00').slice(0, 5),
            ofcEndTime: (orgConfig?.ofcEndTime || '17:00').slice(0, 5),
            dateSeparator: orgConfig?.dateSeparator || ' ',
            ...(saved || {})
        });
    }

    reloadLookups() { location.reload(); }

    onSubmit(form: FormGroup) {
        form.markAllAsTouched();
        if (form.invalid || this.submitted) { return; }

        const raw: any = form.getRawValue();
        if (raw.id == null) {
            this.errorMessage = 'Organization configuration id is missing. Please reload the page.';
            return;
        }

        const data = {
            languageId: Number(raw.languageId),
            currencyId: Number(raw.currencyId),
            timeZone: raw.timeZone,
            ofcStartTime: toTimeSpan(raw.ofcStartTime, '09:00'),
            ofcEndTime: toTimeSpan(raw.ofcEndTime, '17:00'),
            startWeekDay: Number(raw.startWeekDay),
            fyStartDay: Number(raw.fyStartDay),
            fyStartMonth: Number(raw.fyStartMonth),
            dateFormat: raw.dateFormat,
            dateSeparator: raw.dateSeparator ?? ' '
        };

        this.submitted = true;
        this.errorMessage = null;
        this.service.updateUnitConfigSetup(raw.id, data)
            .pipe(finalize(() => this.submitted = false))
            .subscribe({
                next: () => {
                    const language = this.orgLookup.getLanguageById(data.languageId);
                    const currency = this.orgLookup.getCurrencyById(data.currencyId);
                    Object.assign(this.coreService.appSetup.orgConfig, data, {
                        currencyCode: currency?.currencyCode,
                        currencySymbol: currency?.symbol,
                        cultureCode: language?.cultureCode,
                        languageName: language?.name,
                        isConfigured: true
                    });

                    this.wizardService.complete('config', {
                        orgConfig: {
                            ...raw,
                            languageName: language?.name,
                            currencyName: currency ? `${currency.name} (${currency.currencyCode})` : null
                        }
                    });
                    this.wizardService.goNext('config', this.route);
                },
                error: (err) => {
                    this.errorMessage = errorMessageOf(err, 'Failed to save organization configuration.');
                    this.alertService.showMessage('Configuration', this.errorMessage, MessageSeverity.error);
                }
            });
    }
}
