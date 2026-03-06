import {Component, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentInformationService} from "../services/student-information.service";
import {StudentUserCommunication, UserAddress, UserContact} from "../domains/student-user.serializer";

@Component({
  standalone: false,
  selector: 'student-address-guardian',
  templateUrl: './templates/user-address-guardian.html'
})
export class StudentUserAddressGuardianView implements OnInit {

  customForm: FormGroup;
  @Input() userId: string;
  constructor(private fb: FormBuilder,
              public router: Router,
              private activatedRoute: ActivatedRoute,
              public orgUserService: StudentInformationService) {
    this.customForm = this.fb.group({
      communications: this.fb.array([]),
      addresses: this.fb.array([]),
      relation: this.fb.array([])
    });
  }

  ngOnInit() {
    this.populateUserAddressDetails();
  }

  populateUserAddressDetails() {
    const success = (resp) => {
      this.populateForm(resp.data);
    };

    const failure = (resp) => {};
    this.orgUserService.getUserAddressComRelation(this.userId).subscribe(success, failure);
  }

  populateForm(data: StudentUserCommunication){
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

  get relationFormArray() {
    return this.customForm.get('relation') as FormArray<FormGroup>;
  }

  communicationGroup(data = <UserContact>{}) {
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

  addressGroup(userAddress: UserAddress = <UserAddress>{}) {
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
  // addressCb(row: any) {
  //   const data = row.getRawValue();
  //   const inputData: any = {id: data.id, data: data, actionType: (row.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
  //   this.showAddressPopup(inputData);
  // }
  //
  // showAddressPopup(inputData: any) {
  //   const popup = {
  //     header: {text: `${inputData.actionType} ${inputData.data.showName}`, desc: `${inputData.actionType} ${inputData.data.showName}`},
  //     aside: ASIDE_CLASS.RIGHT,
  //     size: ASIDE_SIZE.W_50
  //   };
  //
  //   let modal$ = this.popupService.showCustomPopup(LocationComponent, popup, inputData);
  //   modal$.then((resp) => {
  //     this.popupService.destroy();
  //   }, (err) => {
  //     this.popupService.destroy();
  //   });
  // }
  //
  // guradianCb(row: any) {
  //   const data = row.getRawValue();
  //   const inputData: any = {id: data.id, data: data, actionType: (row.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
  //   this.guradianPopup(inputData);
  // }
  //
  // guradianPopup(inputData: any) {
  //   const popup = {
  //     header: {text: `${inputData.actionType} ${inputData.data.showName}`, desc: `${inputData.actionType} ${inputData.data.showName}`},
  //     aside: ASIDE_CLASS.RIGHT,
  //     size: ASIDE_SIZE.W_50
  //   };
  //
  //   let modal$ = this.popupService.showCustomPopup(GuardianForm, popup, inputData);
  //   modal$.then((resp) => {
  //     this.popupService.destroy();
  //   }, (err) => {
  //     this.popupService.destroy();
  //   });
  // }
  //
  // communicationCb(row) {
  //   const data = row.getRawValue();
  //   const inputData: any = {id: data.id, data: data, actionType: (row.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
  //   this.communicationPopup(inputData);
  // }
  //
  // communicationPopup(inputData: any) {
  //   const popup = {
  //     header: {text: `${inputData.actionType} ${inputData.data.showName}`, desc: `${inputData.actionType} ${inputData.data.showName}`},
  //     aside: ASIDE_CLASS.RIGHT,
  //     size: ASIDE_SIZE.W_75
  //   };
  //
  //   let modal$ = this.popupService.showCustom(CommunicationForm, popup, inputData);
  //   modal$.then((resp) => {
  //     this.popupService.destroy();
  //   }, (err) => {
  //     this.popupService.destroy();
  //   });
  //}
}
