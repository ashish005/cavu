import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import { TrialBusinessAPIResolver, TrialBusinessService} from "../services";
import {CommonModule} from "@angular/common";
import {pairwise, startWith} from "rxjs";

@Component({
  templateUrl: './templates/trial.html',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ]
})
export class TrialBusinessView implements OnInit {
    customForm: FormGroup;
    submitted: boolean = false;
    businessTypes: Array<any> = [];

    successResp: any;
    constructor(private formBuilder: FormBuilder,
                private businessService: TrialBusinessService,
                public apiResolver: TrialBusinessAPIResolver) {
        this.customForm = this.formBuilder.group({
            name: [null, Validators.required],
            address: [null, Validators.required],
            // branchCode: [null],
            // establishedDate: [null, Validators.required],

            orgBusinessTypeId: [null, Validators.required],
            // licenseNo: [null, Validators.required],
            // validFromDate: [null, Validators.required],
            // validToDate: [null, Validators.required],
            contactPersonEmail: [null, Validators.required],
            contactPersonName: [null, Validators.required],
            contactPersonMobile: [null, Validators.required],
            userName: [null, Validators.required],
            operatedById: [null, Validators.required],
            referenceSource: [null],
            // referenceContact: [null],
            // referenceMail: [null],
            countryId: [null, Validators.required],
            softwareId: [null, Validators.required],
        });
    }
    ngOnInit(): void {
        // const date = new Date();
        // const d = DateHelper.toDateControlFormat(date);
        // const toDate = DateHelper.toDateControlFormat(date.setFullYear(date.getFullYear() + 1));
        // this.customForm.patchValue({
        //     name: ,
        //     address: 'test address',
        //     // branchCode: 'code 000',
        //     // establishedDate: d,
        //
        //     orgBusinessTypeId: null,
        //     // licenseNo: 'licenseNo',
        //     // validFromDate: d,
        //     // validToDate: toDate,
        //     contactPersonEmail: 'a@b.com',
        //     contactPersonName: 'test',
        //     contactPersonMobile: '9999999999',
        //     userName: 'test',
        //     operatedById: null,
        //     referenceSource: null,
        //     // referenceContact: null,
        //     // referenceMail: null,
        //     countryId: null
        // });

      const formItemChange=([prev, next]: [any, any])=>
      {
        if(prev != next)
        {
          const { businessTypes } =  this.apiResolver.masterType.softwares.find(r => r.id == next);
          this.businessTypes = businessTypes;
          if(this.businessTypes?.length == 1){
            this.formBusinessType.setValue(this.businessTypes[0].id);
          }
        }
      };
      this.customForm.get('softwareId').valueChanges.pipe(startWith(null as string), pairwise()).subscribe(formItemChange);
    }

    get formCountryId(){ return <FormArray>this.customForm.get('countryId'); }
    get formOperatedBy() { return <FormArray>this.customForm.get('operatedById'); }
    get formRefSource() { return <FormArray>this.customForm.get('referenceSource'); }
    get formSoftware() { return <FormArray>this.customForm.get('softwareId'); }
    get formBusinessType(){ return <FormArray>this.customForm.get('orgBusinessTypeId'); }

    /*updateSoftware(val){
        this.formSoftware.setValue(val);
        this.formBusinessType.reset();
        this.businessTypes = this.apiResolver.masterType.softwares.find(r => r.id == val).businessTypes;
        if(this.businessTypes?.length == 1){
            this.formBusinessType.setValue(this.businessTypes[0].id);
        }
    }*/

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    onSubmit(customForm: any) {
        // stop here if form is invalid
        if (customForm.invalid) {
            return;
        }
        this.submitted = true;

        const performAction = (resp: any)=> {
            this.submitted = false;
            this.successResp = resp;
        };

        const failure = ()=> {
            this.submitted = false;
            this.successResp = null;
        };

        const formValues = customForm.getRawValue();
        formValues.origin = location.host;
        this.businessService.create(formValues).subscribe(performAction, failure);
    }
}
