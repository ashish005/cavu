import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Directive, EventEmitter, Output} from "@angular/core";

@Directive()
export class ProjectAssociateForm
{
    customForm: FormGroup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            projectId: [''],
            moduleId: [''],
            vendorExecutiveId: [''],
            empExecutiveId: [''],

            resourceTypeId: ['', Validators.required],
            billingTypeId: [''],

            empExecutive: [''],
            vendorExecutive: ['']
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get formProjectModuleId(){
        return this.customForm.get('moduleId');
    }
    get formVendorExecutiveId(){
        return this.customForm.get('vendorExecutiveId');
    }
    get formEmpExecutiveId(){
        return this.customForm.get('empExecutiveId');
    }
    get formVendorExecutive(){
        return this.customForm.get('vendorExecutive');
    }
    get formEmpExecutive(){
        return this.customForm.get('empExecutive');
    }

    get formResourceTypeId(){
        return this.customForm.get('resourceTypeId');
    }
    get formBillingTypeId(){
        return this.customForm.get('billingTypeId');
    }

    updateProjectModule(val){
        this.formProjectModuleId.setValue(val);
    }
    updateVendorExecutive(val){
        //this.formVendorExecutiveId.setValue(val);
    }
    updateEmpExecutive(val){
        //this.formEmpExecutiveId.setValue(val);
    }
    updateResourceType(val){
        this.formResourceTypeId.setValue(val);
    }
    updateBillingType(val){
        this.formBillingTypeId.setValue(val);
    }
}