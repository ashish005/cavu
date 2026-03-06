import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

export class BatchFeeFormForm {
    customForm: FormGroup;

    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            applicationFormNo: [null],
            rollNo: [null],
            enrollmentDate: [null],
            orgBatchId: [null, [Validators.required]],
            orgSessionId: [null], // Only to make call to fee plan
            studyModeId: [null],
            studentId: [null],
            courseId: [null, [Validators.required]],
            courseSectionId: [null],
            orgClassId: [null, [Validators.required]],
            classSectionId: [null],
            feePlanId: [null, [Validators.required]],
            feeConcessionTypeId: [null],
            feeConcessionRemark: [null],
            netFee: [{ value: null, disabled: true} ]
        });
    }

    get formOrgSession() { return <FormGroup>this.customForm.get('orgSessionId'); }
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    get hasBatchId(){ return (this.formId.value); }
    get formId() { return <FormGroup>this.customForm.get('id'); }
    get formNetFee() { return <FormGroup>this.customForm.get('netFee'); }

    get formOrgBatch() { return <FormGroup>this.customForm.get('orgBatchId'); }
    get formStudentId() { return <FormGroup>this.customForm.get('studentId'); }
    get formStudyMode() { return <FormArray>this.customForm.get('studyModeId'); }

    get formCourse() { return <FormGroup>this.customForm.get('courseId'); }
    get formCourseSection() { return <FormGroup>this.customForm.get('courseSectionId'); }
    get formClass() { return <FormGroup>this.customForm.get('orgClassId'); }
    get formClassSection() { return <FormGroup>this.customForm.get('classSectionId'); }

    get formFeePlan() { return <FormGroup>this.customForm.get('feePlanId'); }
    get formFeeConcession() { return <FormGroup>this.customForm.get('feeConcessionTypeId'); }
    get formFeeConcessionRemark() { return <FormGroup>this.customForm.get('feeConcessionRemark'); }

    updateStudyMode(val){ this.formStudyMode.setValue(val); }
    updateClassSection(classSectionId) { this.formClassSection.setValue(classSectionId); }
    updateFeeConcessionRemark(data) { this.formFeeConcessionRemark.setValue(data); }

    populateForm(data: any){
        const {
            applicationFormNo, rollNo, enrollmentDate, orgBatchId, studentId, courseId, courseSectionId,
            orgClassId, classSectionId, feePlanId, feeConcessionTypeId, feeConcessionRemark
        } = data;

        this.customForm.get('applicationFormNo').setValue(applicationFormNo);
        this.customForm.get('rollNo').setValue(rollNo);
        this.customForm.get('enrollmentDate').setValue(enrollmentDate || Date.now());
        this.customForm.get('orgBatchId').setValue(orgBatchId);

        this.customForm.get('studentId').setValue(studentId);
        this.customForm.get('courseId').setValue(courseId);
        this.customForm.get('courseSectionId').setValue(courseSectionId);
        this.customForm.get('orgClassId').setValue(orgClassId);
        this.customForm.get('classSectionId').setValue(classSectionId);

        this.customForm.get('feePlanId').setValue(feePlanId);
        this.customForm.get('feeConcessionTypeId').setValue(feeConcessionTypeId);
        this.customForm.get('feeConcessionRemark').setValue(feeConcessionRemark);
    }
}