import {Component, Input, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FetchEmployeeService, OrgUserAPIResolver} from "../services";
import {OrgEmployee} from "../domains/org-employee.serializer";

@Component({
  standalone: false,
  selector: 'employee-info',
  templateUrl: './templates/ce-user-info.html'
})
export class OrgUserInfoCEView implements OnInit {
  profileUrl: string;
  profileId: string;
  submitted: boolean;
  @Input() set data(val: OrgEmployee){
      this.populateForm(val || <any>{});
      this.profileUrl = val?.profileUrl;
      this.profileId = val?.profileId;
  };
  @Input() id: string;
  customForm: FormGroup;
  constructor(private fb: FormBuilder, public service: FetchEmployeeService, public apiResolver: OrgUserAPIResolver) {
    this.customForm = this.fb.group({
        registrationNo: [{value: null, disabled: true}, Validators.required],
        registrationDate: [null],
        joiningDate: [null],
        fName: [null, Validators.required],
        lName: [null, Validators.required],
        email: [null, Validators.required],
        phone: [null, Validators.required],
        dob: [null],
        genderId: [null, Validators.required],
        bloodGroupId: [null],
        nationalityId: [null, Validators.required],
        maritalStatusId: [null, Validators.required],
        religionId: [null],
        casteId: [null],
        reservationCategoryId: [null],
        dutyTypeId: [null],
        postId: [null],
        roles: this.fb.array([])
    });
  }

  updateOrgImage(fileDocument: any){
    const successAction = (resp)=> {};
    const progressCb = ()=> {};
    this.service.updateUserProfile(this.id, this.profileId, fileDocument, successAction, progressCb);
  }

  /*public get fileUrl(){
    if(this.user?.profileId && this.user?.profileUrl){
      return this.user.profileUrl;
    }
    return null;
  }*/

  populateForm(data: OrgEmployee){
    if(data.id){ this.customForm.get('registrationNo').setValue(data.registrationNo); }

    this.customForm.get('registrationDate').setValue(data.registrationDate);
    this.customForm.get('joiningDate').setValue(data.joiningDate);
    this.customForm.get('dob').setValue(data.dob);

    this.customForm.get('fName').setValue(data.fName);
    this.customForm.get('lName').setValue(data.lName);
    this.customForm.get('email').setValue(data.email);
    this.customForm.get('phone').setValue(data.phone);

    this.updateGender(data.genderId);
    this.updateBloodGroup(data.bloodGroupId);
    this.updateNationality(data.nationalityId);
    this.updateMaritalStatus(data.maritalStatusId);
    this.updateReligion(data.religionId);
    this.updateCaste(data.casteId);
    this.updateReservation(data.reservationCategoryId);
    this.updateDutyType(data.dutyTypeId);
    this.updateEmployeePost(data.postId);
    this.updateRoles(data.roles);
  }

    updateRoles(item){
        this.formEmployeeRoles.controls.length = 0;
        (item || []).forEach((val: number) => { this.formEmployeeRoles.push(this.fb.control(val)); });
        if(!item || item.length === 0){ this.formEmployeeRoles.setValue([]); }
    }

  ngOnInit() {
    if (!this.id) {
      const success = (regNoData) => this.customForm.get('registrationNo').setValue(regNoData.data);
      const failure = () => console.log('registration no not able to fetch');
      this.service.getRegistrationNo().subscribe(success, failure);
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
  get formGender() { return <FormGroup>this.customForm.get('genderId'); }
  get formBloodGroup() { return <FormGroup>this.customForm.get('bloodGroupId'); }
  get formNationality() { return <FormGroup>this.customForm.get('nationalityId'); }
  get formMaritalStatus() { return <FormGroup>this.customForm.get('maritalStatusId');}
  get formReligion() { return <FormGroup>this.customForm.get('religionId'); }
  get formCaste() { return <FormGroup>this.customForm.get('casteId'); }
  get formReservation() { return <FormGroup>this.customForm.get('reservationCategoryId'); }
  get formDutyType() { return <FormGroup>this.customForm.get('dutyTypeId'); }
  get formEmployeePost() { return <FormGroup>this.customForm.get('postId');  }
  get formEmployeeRoles() { return <FormArray>this.customForm.get('roles'); }



  updateGender(val) { this.formGender.setValue(val); }
  updateBloodGroup(val) { this.formBloodGroup.setValue(val); }
  updateNationality(val) { this.formNationality.setValue(val); }
  updateMaritalStatus(val) { this.formMaritalStatus.setValue(val); }
  updateReligion(val) { this.formReligion.setValue(val); }
  updateCaste(val) { this.formCaste.setValue(val); }
  updateReservation(val) { this.formReservation.setValue(val); }
    updateDutyType(val){ this.formDutyType.setValue(val); }
    updateEmployeePost(val){ this.formEmployeePost.setValue(val); }

  updateOrgUser(data) {
    //stop here if form is invalid
    if (data.invalid) {
      this.submitted = false;
      return;
    }

    this.submitted = true;

    const performAction = (resp) => {
      this.submitted = false;
    };
    const createPerformAction = (resp) => { this.submitted = false; };
    const failure = () => { this.submitted = false; };

    const _data = data.getRawValue();
    if (this.id) {
      this.service.update(this.id, _data).subscribe(performAction, failure);
    } else {
      this.service.create(_data).subscribe(createPerformAction, failure);
    }
  }
}
