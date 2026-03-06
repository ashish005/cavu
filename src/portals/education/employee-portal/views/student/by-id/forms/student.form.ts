import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Student} from "../domains/student.serializer";

export class StudentForm  {
    public customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            registrationNo: [{value: null, disabled: true}, Validators.required],
            registrationDate: [null],
            //joiningDate: [null],
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
            dutyTypeId: [null],
            postId: [null]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get orgTaskName() { return this.customForm.get('orgTaskName'); }
    get feePlanOrgTaskId() { return <FormGroup>this.customForm.get('orgTaskId'); }
    get formCourse() { return <FormGroup>this.customForm.get('courseId'); }
    get formCourseSection() { return <FormGroup>this.customForm.get('courseSectionId'); }
    get formStudyMode() { return <FormGroup>this.customForm.get('studyModeTypeId'); }
    get formOrgSession() { return <FormGroup>this.customForm.get('orgSessionId'); }
    get formStudyLevel() { return <FormGroup>this.customForm.get('studyLevel'); }

    populateForm(data: Student){
        if(data.id){
            this.customForm.get('registrationNo').setValue(data.registrationNo);
        }

        const registrationDate = data.registrationDate;
        //const joiningDate = data.joiningDate;
        const dob = data.dob;

        this.customForm.get('registrationDate').setValue(registrationDate);
        //this.customForm.get('joiningDate').setValue(joiningDate);
        this.customForm.get('dob').setValue(dob);

        this.customForm.get('fName').setValue(data.fName);
        this.customForm.get('mName').setValue(data.mName);
        this.customForm.get('lName').setValue(data.lName);
        this.customForm.get('email').setValue(data.email);
        this.customForm.get('phone').setValue(data.phone);


        this.updateGender(data.genderId);
        this.updateBloodGroup(data.bloodGroupId);
        this.updateNationality(data.nationalityId);
        this.updateMaritalStatus(data.maritalStatusId);
        this.updateReligion(data.religion);
        this.updateCaste(data.casteId);
        this.updateReservation(data.reservationCategoryId);
    }

    get formGender() { return <FormGroup>this.customForm.get('genderId');}

    get formBloodGroup() { return <FormGroup>this.customForm.get('bloodGroupId'); }

    get formNationality() { return <FormGroup>this.customForm.get('nationalityId');}

    get formMaritalStatus() { return <FormGroup>this.customForm.get('maritalStatusId');}

    get formReligion() { return <FormGroup>this.customForm.get('religion'); }

    get formCaste() { return <FormGroup>this.customForm.get('casteId');}

    get formReservation() { return <FormGroup>this.customForm.get('reservationCategoryId'); }

    get formDutyType() { return <FormArray>this.customForm.get('dutyTypeId'); }

    get formEmployeePost() { return <FormArray>this.customForm.get('postId'); }

    updateDutyType(val){ this.formDutyType.setValue(val); }

    updateEmployeePost(val){ this.formEmployeePost.setValue(val); }

    updateGender(val) { this.formGender.setValue(val); }

    updateBloodGroup(val) { this.formBloodGroup.setValue(val); }

    updateNationality(val) { this.formNationality.setValue(val); }

    updateMaritalStatus(val) { this.formMaritalStatus.setValue(val); }

    updateReligion(val) { this.formReligion.setValue(val); }

    updateCaste(val) { this.formCaste.setValue(val); }
    updateReservation(val) { this.formReservation.setValue(val); }
}