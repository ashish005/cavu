import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ACTION_ENUM} from "@app-global";
import {OrgBranchService} from "../services/org-branch.service";
import {Branch} from "../domains/org-branch.serializer";

class BranchFormComponent {
  customForm: FormGroup;

  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: ['', Validators.required],
      address: [null, Validators.required],
      branchCode: [null, Validators.required],
      websiteUrl: [null],
      contactName: [null, Validators.required],
      contactNo1: [null, Validators.required],
      contactNo2: [null],
      emailId1: [null, Validators.required],
      emailId2: [null],
      establishedDate: [null, Validators.required],
      isSelfAdministration: [null],
      countryId: [null, Validators.required],
      isHeadBranch: [null],
      isActive: [null]
    });
  }

  populateBranchForm(data: Branch){
    this.customForm.get('name').setValue(data.name);
    this.customForm.get('address').setValue(data.address);
    this.customForm.get('websiteUrl').setValue(data.websiteUrl);
    this.customForm.get('branchCode').setValue(data.branchCode);
    this.customForm.get('contactName').setValue(data.contactName);
    this.customForm.get('contactNo1').setValue(data.contactNo1);
    this.customForm.get('contactNo2').setValue(data.contactNo2);
    this.customForm.get('emailId1').setValue(data.emailId1);
    this.customForm.get('emailId2').setValue(data.emailId2);
    this.customForm.get('establishedDate').setValue(data.establishedDate);
    this.customForm.get('isSelfAdministration').setValue(data.isSelfAdministration);
    this.customForm.get('countryId').setValue(data.countryId);
    this.customForm.get('isHeadBranch').setValue(data.isHeadBranch);
    this.customForm.get('isActive').setValue(data.isActive);
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
}

@Component({
    standalone: false,
  selector: 'org-branch-create-edit',
  templateUrl: './templates/branch-create-edit.html',
  styles: [`:host { display: contents; }`]
})
export class OrgBranchCreateEditComponent extends BranchFormComponent {
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Input() id: string;
  @Input() unitId: string;
  @Input() set data(value: Branch)
  {
    this.populateBranchForm(value || <Branch>{});
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  submitted: boolean;
  constructor(public override fb: FormBuilder, public service: OrgBranchService) {
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
    data.unitId = this.unitId;
    if(this.id){
      this.service.update(this.id, data).subscribe(success, error);
    } else {
      this.service.create(data).subscribe(success, error);
    }
  }
}
