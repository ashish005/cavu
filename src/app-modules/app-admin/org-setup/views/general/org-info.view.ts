import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Org} from "../../domains/org.serializer";
import {OrgSetupAPIResolver} from "../../services/api.resolver";
import {OrgService} from "../../services/org.service";

@Component({
    standalone: false,
    templateUrl: './templates/org-info.html',
})
export class OrgInfoView implements OnInit {
    title: string = "Business";
    customForm: FormGroup;
    submitted: boolean = false;
    constructor(public fb: FormBuilder, public apiResolver: OrgSetupAPIResolver, public service: OrgService) {
        //super(fb, apiResolver);
        this.customForm = this.fb.group({
            name: [null, Validators.required],
            contactNo1: [null, Validators.required],
            contactNo2: [null],
            emailId1: [null, Validators.required],
            emailId2: [null],
            establishedDate: [null],
            affiliatedName: [null],
            operatedById: [null, Validators.required],
            address:[null, Validators.required],
            
            // Tenant specific details
            licenseNo: [null],

            validFromDate: [null],
            validToDate: [null],
            contactPersonEmail: [null, Validators.required],
            contactPersonName: [null, Validators.required],
            contactPersonMobile: [null, Validators.required],

            referenceSource: [null],
            referenceContact: [null],
            referenceMail: [null]
        });
    }

    ngOnInit()
    {
        this.updateOrganizationForm(this.service.org);
    }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formOperatedBy() { return <FormArray>this.customForm.get('operatedById'); }
    updateOperatedBy(val){ this.formOperatedBy.setValue(val); }

    updateOrganizationForm(org: Org){
        this.customForm.get('name').setValue(org.name);
        this.customForm.get('address').setValue(org.address);
        this.customForm.get('contactNo1').setValue(org.contactNo1);
        this.customForm.get('contactNo2').setValue(org.contactNo2);
        this.customForm.get('emailId1').setValue(org.emailId1);
        this.customForm.get('emailId2').setValue(org.emailId2);
        this.customForm.get('establishedDate').setValue(org.establishedDate);
        this.customForm.get('affiliatedName').setValue(org.affiliatedName);
        this.customForm.get('operatedById').setValue(org.operatedById);
        // this.customForm.get('tenant').patchValue(org.tenant);
        // this.customForm.get('config').patchValue(org.config);

        const tenant = org.tenant;
        this.customForm.get('licenseNo').patchValue(tenant.licenseNo);
        this.customForm.get('validFromDate').patchValue(tenant.validFromDate);
        this.customForm.get('validToDate').patchValue(tenant.validToDate);
        this.customForm.get('contactPersonEmail').patchValue(tenant.contactPersonEmail);
        this.customForm.get('contactPersonName').patchValue(tenant.contactPersonName);
        this.customForm.get('contactPersonMobile').patchValue(tenant.contactPersonMobile);
        this.customForm.get('referenceSource').patchValue(tenant.referenceSource);
        this.customForm.get('referenceContact').patchValue(tenant.referenceContact);
        this.customForm.get('referenceMail').patchValue(tenant.referenceMail);
    }

    onOrgSubmit(form: FormGroup){
        // stop here if form is invalid
        if (this.customForm.invalid) {
            return;
        }
        this.submitted = true;

        const success = (resp: any)=>{
            this.submitted = false;
        };

        const error = (resp: any)=>{ this.submitted = false; };

        const data = form.getRawValue();
        this.service.updateOrganization(data).subscribe(success, error);
    }

    updateOrgImage(fileDocument: any){
        const successAction = (resp)=> {};
        const progressCb = ()=> {};
        this.service.updateOrganizationProfile(fileDocument, successAction, progressCb);
    }
}