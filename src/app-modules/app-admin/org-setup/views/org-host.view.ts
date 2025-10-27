import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {OrgSetupAPIResolver} from "../services/api.resolver";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgService} from "../services/org.service";

@Component({
    templateUrl: './templates/org-host.html'
})
export class OrgHostView implements OnInit{
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;

    customForm: FormGroup;
    submitted: boolean = false;

    constructor(public fb: FormBuilder, public apiResolver: OrgSetupAPIResolver, public orgService: OrgService) {
        this.customForm = this.fb.group({
            hostConfigs: this.fb.array([])
        });
    }

    ngOnInit(){
        const { hostConfigs } = this.orgService.org;
        (hostConfigs || []).forEach(r => { this.hostConfigsForm.push(this.formHostConfig(r)); });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get hostConfigsForm(): FormArray { return <FormArray>this.customForm.get('hostConfigs'); }
    addHostConfig() { this.hostConfigsForm.push(this.formHostConfig({}));}
    removeHostConfig(index) { this.hostConfigsForm.removeAt(index); }

    /*populateHostConfigForm(data: any){
        this.customForm.get('id').setValue(data.id);
        this.customForm.get('connectionName').setValue(data.connectionName);
        this.customForm.get('connectionType').setValue(data.connectionType);
        this.customForm.get('enable').setValue(data.enable);
        this.customForm.get('hostName').setValue(data.hostName);
    }*/

    formHostConfig(data: any)
    {
        const { id, name, connectionName, connectionString, connectionType, isUnderConstruction, enable, hostName, tenantPoint } = data;
        return this.fb.group(<any>{
            id: [id],
            name: [name],
            connectionName: [connectionName],
            connectionString: [connectionString],
            connectionType: [connectionType],
            isUnderConstruction: [isUnderConstruction],
            enable: [enable],
            hostName: [hostName, Validators.required],
            tenantPoint: [tenantPoint],
        });
    }

    onOrgSubmit(form: FormGroup){
        // stop here if form is invalid
        if (this.customForm.invalid) {
            return;
        }
        this.submitted = true;

        const success = (resp: any)=>{ this.submitted = false; };

        const error = (resp: any)=>{ this.submitted = false; };

        const data = form.getRawValue();
        this.orgService.updateHostConfig(data).subscribe(success, error);
    }
}