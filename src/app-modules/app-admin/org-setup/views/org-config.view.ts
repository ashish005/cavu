import {Component, Input, OnInit} from '@angular/core';
import {OrgSetupAPIResolver} from "../services/api.resolver";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgSettingService} from "../services/org-setting.service";
import {AppSetup, AppSetupService} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/org-config.html'
})
export class OrgConfigView implements OnInit{
    submitted: boolean = false;
    customForm: FormGroup;
    orgSetup: AppSetup;
    constructor(public fb: FormBuilder, public apiResolver: OrgSetupAPIResolver,
                public service: OrgSettingService, public appSetupService: AppSetupService) {
        this.customForm = this.fb.group({
            id: [null],
            passwordChangeOnFirstLoginEnabled: [null],

            hasMultipleBranch: [null],
            hasMultiCurrency: [null],
            hasMultiLanguage: [null],

            hasMultipleStudyMode: [null],
            hasMultipleClassSection: [null],
            hasMultipleCourseSection: [null],

            hasMultiProjectModule: [null],
            hasProjectWorkFlow: [null]
        });
        this.orgSetup = appSetupService.appSetup;
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    ngOnInit() {
        //this.orgSetup = this.coreService.orgSetup;
        //const { orgConfig, options } = this.coreService.orgSetup;

        //this.customForm.patchValue(<any>options);
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

    onSubmit(formData) {
        if (formData.invalid) { return; } // stop here if form is invalid

        this.submitted = true;
        const success = (resp: any) => { this.submitted = false; };
        const error = (resp: any) => { this.submitted = false; };

        const data = formData.getRawValue();
        this.service.updateGeneralOrgConfig(data?.id, data).toPromise().then(success, error);
    }
}
