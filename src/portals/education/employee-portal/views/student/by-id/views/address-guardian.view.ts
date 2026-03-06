import {Component, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../services/student.service";
import {StudentAPIResolver} from "../services/api.resolver";
import {StudentAddress, StudentCommunication, StudentContact} from "../domains/contact.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/address-guardian.html'
})
export class AddressGuardianView implements OnInit {
  customForm: FormGroup;
  studentId: string;
  constructor(private fb: FormBuilder, public router: Router,
              public apiResolver: StudentAPIResolver,
              public service: StudentService) {
    this.customForm = this.fb.group({
      communications: this.fb.array([]),
      addresses: this.fb.array([]),
      relation: this.fb.array([])
    });
  }

  ngOnInit() {
    this.studentId = this.service.student.id;
    this.populateUserAddressDetails();
  }

  populateUserAddressDetails() {
    const success = (resp) => {
      this.populateForm(new StudentCommunication(resp.data));
    };

    const failure = (resp) => {};
    this.service.getUserAddressComRelation(this.studentId).subscribe(success, failure);
  }

  populateForm(data: StudentCommunication){
    const contacts = data.userContact;
    const addresses = data.userAddress;
    const relations = data.userRelation;
    this.communicationFormArray.controls.length = 0;
    this.addressFormArray.controls.length = 0;
    this.relationFormArray.controls.length = 0;

    (contacts ||[]).map((r) => {
      this.communicationFormArray.controls.push(this.communicationGroup(r));
    });

    (addresses ||[]).map((r) => {
      this.addressFormArray.controls.push(this.addressGroup(r));
    });

    (relations ||[]).map((r) => {
      this.relationFormArray.controls.push(this.relationGroup(r));
    });
  }

  get communicationFormArray(): FormArray<FormGroup> {
    return this.customForm.get('communications') as FormArray<FormGroup>;
  }

  get addressFormArray(): FormArray<FormGroup> {
    return this.customForm.get('addresses') as FormArray<FormGroup>;
  }

  get relationFormArray(): FormArray<FormGroup> {
    return this.customForm.get('relation') as FormArray<FormGroup>;
  }

  communicationGroup(data = <StudentContact>{}) {
    //populate id and name
    return this.fb.group({
      id: [data.id],
      name: [data.name],
      userContactTypeId: [data.userContactTypeId, Validators.required],
      showName: [{value: data.showName, disabled: true}]
    });
  }

  relationGroup(data: any = {}) {
    return this.fb.group({
      id: [data.id],
      isPrimary: [data.isPrimary],
      title: [data.title],
      fName: [data.fName],
      lName: [data.lName],
      email: [data.email],
      phone: [data.phone],
      qualificationId: [data.qualificationId],
      professionId: [data.professionId],
      departmentId: [data.departmentId],
      incomeId: [data.incomeId],
      relationTypeId: [data.relationTypeId],
      showName: [{value: data.showName, disabled: true}]
    });
  }

  addressGroup(userAddress: StudentAddress = <StudentAddress>{}) {
    return this.fb.group({
      id: [userAddress.id || null],
      address1: [userAddress.address1 || null],
      address2: [userAddress.address1 || null],
      pinCodeId: [userAddress.pinCodeId || null],
      cityId: [userAddress.cityId || null],
      stateId: [userAddress.stateId || null],
      countryId: [userAddress.countryId || null],
      userAddressTypeId: [userAddress.userAddressTypeId, Validators.required],
      showName: [{value: userAddress.showName, disabled: true}]
    });
  }



  addressCb(row: any) {
    const data = row.getRawValue();
    const inputData: any = {id: data.id, data: data, actionType: (row.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
    this.apiResolver.showAddressPopup(inputData);
  }

  guradianCb(row: any) {
    const data = row.getRawValue();
    const inputData: any = { id: data.id, studentId: this.studentId , data: data, actionType: (row.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
    this.apiResolver.guradianPopup(inputData);
  }

  communicationCb(row) {
    const data = row.getRawValue();
    const inputData: any = {id: data.id, data: data, actionType: (row.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
    this.apiResolver.communicationPopup(inputData);
  }
}
