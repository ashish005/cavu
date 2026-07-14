import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BusinessAPIResolver} from "../services/api.resolver";
import {Business} from "../domains/business.serializer";
import {ACTION_ENUM} from "@app-global";
import {BusinessHostConfig} from "../domains/business-host.serializer";
import {BusinessService} from "../views/business-manage.view";

const Referrals: Array<any> = [
  { name: 'Facebook' },
  { name: 'Twitter' },
  { name: 'LinkedIn' },
  { name: 'Instagram' },
  { name: 'Pinterest' },
  { name: 'WhatsApp' },
  { name: 'Other social networks' }
];

@Component({
  templateUrl: 'templates/create-edit-business.html',
  styles: [`:host {display: contents;}`],
  providers: [BusinessService],
  standalone: false
    //styles:[`::ng-deep .ng-value-container { display: contents; } ::ng-deep .ng-placeholder{ display: none !important;}`]
})
export class CreateEditBusinessView implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  businessForm: FormGroup;
  submitted: boolean = false;
  @Input() id: any;
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any>= new EventEmitter<any>();

  get hostConfigsForm() { return this.businessForm.get('hostConfigs') as FormArray; }
  // A getter to get the controls as FormGroups
  get hostItems() { return (this.hostConfigsForm.controls as FormGroup[]); }

  addHostConfig() { this.hostConfigsForm.push(this.formHostConfig(new BusinessHostConfig({}))); }

  removeHostConfig(index) { this.hostConfigsForm.removeAt(index); }

  @Input() set data(val: Business) {
    const now = new Date();
    const next1Year =  new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    const { id, name,
        orgBusinessTypeId, licenseNo, validFromDate, validToDate, contactPersonEmail, contactPersonName, contactPersonMobile,
      userName, operatedById, referenceSource, referenceContact, referenceMail, countryId, orgUnitId,
      hostConfigs
    } = val || new Business({ validFromDate: now, validToDate: now });

    const dataItem = {
        orgUnitId: orgUnitId,
        name: name,
        orgBusinessTypeId: orgBusinessTypeId,
        licenseNo: licenseNo,
        validFromDate: validFromDate,
        validToDate: validToDate,
        contactPersonEmail: contactPersonEmail,
        contactPersonName: contactPersonName,
        contactPersonMobile: contactPersonMobile,
        userName: userName,
        operatedById: operatedById,
        referenceSource: referenceSource,
        referenceContact: referenceContact,
        referenceMail: referenceMail,
        countryId: countryId,
        hostConfigs: hostConfigs || [new BusinessHostConfig({})]
    };
    this.businessForm.patchValue(dataItem);
    (hostConfigs || [new BusinessHostConfig({})]).forEach(r => {
        this.hostConfigsForm.push(this.formHostConfig(r));
    });

    if(id){
      this.businessForm.get('userName').setValue('***********');
      this.businessForm.get('userName').setValidators(null);
      this.businessForm.get('userName').disable();
    }
  };

  disableControls: boolean;

  constructor(private formBuilder: FormBuilder,
              private businessService: BusinessService,
              public apiResolver: BusinessAPIResolver) {
    this.viewType = this.manage.create;
    this.businessForm = this.formBuilder.group({
      name: [null, Validators.required],
      orgBusinessTypeId: ['', Validators.required],

      licenseNo: [null],
      validFromDate: [null, Validators.required],
      validToDate: [null, Validators.required],

      contactPersonEmail: ['', Validators.required],
      contactPersonName: ['', Validators.required],
      contactPersonMobile: ['', Validators.required],

        operatedById: ['', Validators.required],
        referenceSource: [''],
        referenceContact: [''],
        referenceMail: [''],

      userName: [null, Validators.required],

      countryId: [null, Validators.required],
      softwareId: [null],
      licenseTypeId: [null],
      orgUnitId: [''],
      hostConfigs: this.formBuilder.array([])
    });
  }

  formHostConfig(data: BusinessHostConfig){
      const { id, name, connectionName, connectionString, connectionType, isUnderConstruction, enable, hostName, tenantPoint } = data;
      return this.formBuilder.group(<any>{
          id: [id],
          name: [name],
          // connectionName: [connectionName],
          // connectionString: [connectionString],
          // connectionType: [connectionType],
          isUnderConstruction: [isUnderConstruction],
          enable: [enable],
          hostName: [hostName, Validators.required],
          tenantPoint: [tenantPoint]
      });
  }

  activeNavId: number = 1;
  manage: any = {
    create:{ type:'create' },
    edit:{ type:'edit' }
  };
  navList: Array<any> = [
    {id:1, name: "New Business"}
  ];

  viewType: any;
  referrals: Array<any> = Referrals;

  updateNav(nav){
    this.activeNavId = nav.id;
  }

  ngOnInit(): void {
    this.disableControls = (this.id && this.id>0);
  }

  get formBusinessTypeId(){
    return <FormArray>this.businessForm.get('orgBusinessTypeId');
  }

  get formCountryId(){
    return <FormArray>this.businessForm.get('countryId');
  }

  get formSoftwareId(){
      return <FormArray>this.businessForm.get('softwareId');
  }

    get formLicenseTypeId(){
        return <FormArray>this.businessForm.get('licenseTypeId');
    }

    updateLicenseType(val){
        this.formLicenseTypeId.setValue(val);
    }

  updateSoftware(val){
      this.formSoftwareId.setValue(val);
  }

  updateBusinessTypeId(val){
    this.formBusinessTypeId.setValue(val);
  }

  updateCountryId(val){
    this.formCountryId.setValue(val);
  }

  get formOperatedBy() {
    return <FormArray>this.businessForm.get('operatedById');
  }

  updateOperatedBy(val){
    this.formOperatedBy.setValue(val);
  }

  // convenience getter for easy access to form fields
  get f() { return this.businessForm.controls; }

    get formRefSource() { return <FormArray>this.businessForm.get('referenceSource'); }
    updateRefSource(val){ this.formRefSource.setValue(val); }

  onSubmit(businessForm) {
    // stop here if form is invalid
    if (businessForm.invalid) {
      return;
    }
    this.submitted = true;

    const performAction = (resp)=> {
      this.submitted = false;
      this.onOk.emit(true);
    };

    const failure = ()=> {
      this.submitted = false;
    };

    const formValues = businessForm.getRawValue();
    if(this.actionType == ACTION_ENUM.UPDATE) {
      this.businessService.update(this.id, formValues).subscribe(performAction, failure);
    } else if(this.actionType == ACTION_ENUM.ADD) {
      this.businessService.create(formValues).subscribe(performAction, failure);
    }
  }
}
