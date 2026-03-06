import {Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentInformationService} from "../services/student-information.service";
import {StudentUser} from "../domains/student-user.serializer";

@Component({
  standalone: false,
  selector: 'student-info',
  templateUrl: './templates/ce-user-info.html'
})
export class StudentUserInfoCeComponent implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  customForm: FormGroup;
  submitted: boolean;
  @Input() userId: string; //Student or Employee user Id

  constructor(private fb: FormBuilder,
              public router: Router,
              private activeRoute: ActivatedRoute,
              public orgUserService: StudentInformationService) {
    this.customForm = this.fb.group({
      registrationNo: [{value: null, disabled: true}, Validators.required],
      registrationDate: [null, Validators.required],
      fName: [null, Validators.required],
      mName: [null],
      lName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      dob: [null, Validators.required],
      genderId: [null, Validators.required],
      bloodGroupId: [null],
      nationalityId: [null, Validators.required],
      maritalStatusId: [null, Validators.required],
      religion: [null],
      casteId: [null],
      reservationCategoryId: [],
    });
  }

  populateForm(data: StudentUser){
    this.customForm.get('registrationNo').setValue(data.registrationNo);

    this.customForm.get('registrationDate').setValue(data.registrationDate);
    this.customForm.get('fName').setValue(data.fName);
    this.customForm.get('mName').setValue(data.mName);
    this.customForm.get('lName').setValue(data.lName);
    this.customForm.get('email').setValue(data.email);
    this.customForm.get('phone').setValue(data.phone);
    this.customForm.get('dob').setValue(data.dob);

    this.updateGender(data.genderId);
    this.updateBloodGroup(data.bloodGroupId);
    this.updateNationality(data.nationalityId);
    this.updateMaritalStatus(data.maritalStatusId);
    this.updateReligion(data.religion);
    this.updateCaste(data.casteId);
    this.updateReservation(data.reservationCategoryId);
  }

  ngOnInit() {
    this.orgUserService.getByUserId(this.userId).subscribe((r) => {
      if(r.data) {
        this.populateForm(r.data);
      }
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.customForm.controls;
  }

  get formGender() {
    return <FormGroup>this.customForm.get('genderId');
  }

  get formBloodGroup() {
    return <FormGroup>this.customForm.get('bloodGroupId');
  }

  get formNationality() {
    return <FormGroup>this.customForm.get('nationalityId');
  }

  get formMaritalStatus() {
    return <FormGroup>this.customForm.get('maritalStatusId');
  }

  get formReligion() {
    return <FormGroup>this.customForm.get('religion');
  }

  get formCaste() {
    return <FormGroup>this.customForm.get('casteId');
  }

  get formReservation() {
    return <FormGroup>this.customForm.get('reservationCategoryId');
  }

  updateGender(val) {
    this.formGender.setValue(val);
  }

  updateBloodGroup(val) {
    this.formBloodGroup.setValue(val);
  }

  updateNationality(val) {
    this.formNationality.setValue(val);
  }

  updateMaritalStatus(val) {
    this.formMaritalStatus.setValue(val);
  }

  updateReligion(val) {
    this.formReligion.setValue(val);
  }

  updateCaste(val) {
    this.formCaste.setValue(val);
  }

  updateReservation(val) {
    this.formReservation.setValue(val);
  }
}
