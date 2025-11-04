import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {OrgHostConfigService} from "../services/org-host.service";
import {OrgHostConfig} from "../domains/org-host-config.serializer";
import {OrgService} from "../services/org.service";

class HostConfigFormComponent {
  customForm: FormGroup;

  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      id: [''],
      isUnderConstruction: [true, Validators.required],
      enable: [false, Validators.required],
      hostName: [null, Validators.required],
      tenantPoint: [null, Validators.required]
      // connectionName: [connectionName],
      // connectionString: [connectionString],
      // connectionType: [connectionType]
    });
  }

  populateForm(data: any){
    this.customForm.get('id').setValue(data.id);
    this.customForm.get('isUnderConstruction').setValue(data.isUnderConstruction);
    this.customForm.get('tenantPoint').setValue(data.tenantPoint);
    this.customForm.get('enable').setValue(data.enable);
    this.customForm.get('hostName').setValue(data.hostName);
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
}
@Component({
  standalone: false,
  templateUrl: './templates/host-config-ce.html',
  styles: [`:host { display: contents; }`]
})
export class HostConfigCEComponent extends HostConfigFormComponent {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Input() id: string;
  @Input() set data(value: OrgHostConfig)
  {
    this.populateForm(value || <OrgHostConfig>{});
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  submitted: boolean;
  constructor(public override fb: FormBuilder, public orgService: OrgService, public service: OrgHostConfigService) {
    super(fb);
  }

  onSubmit(customForm) {
    // stop here if form is invalid
    if (customForm.invalid) {
      return;
    }
    this.submitted = true;
    const error = (err) =>{
      this.submitted = false;
    };

    const success = (branches) =>{
      this.submitted = false;
      this.onOk.emit(branches);
    };
    const data = customForm.getRawValue();
    data.tenantId = this.orgService.org.tenant.id;
    if(this.id){
      this.service.update(this.id, data).subscribe(success, error);
    } else {
      this.service.create(data).subscribe(success, error);
    }
  }
}
