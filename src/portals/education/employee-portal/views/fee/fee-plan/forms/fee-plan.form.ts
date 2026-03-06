import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FeePlan} from "../domains/fee-plan.serializer";
import {FeeStructure} from "../domains/fee-structure.serializer";

export class FeePlanForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            name: [null, Validators.required],
            //orgTaskName: [null],
            //orgTaskId: [null],
            orgSessionId: [null, Validators.required],
            studyModeTypeId: [null, Validators.required],
            courseId: [null, Validators.required],
            courseSectionId: [null, Validators.required],
            feeStructureList: this.fb.array([])
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }

    //get orgTaskName() { return this.customForm.get('orgTaskName'); }
    //get feePlanOrgTaskId() { return <FormGroup>this.customForm.get('orgTaskId'); }
    get formCourse() { return <FormGroup>this.customForm.get('courseId'); }
    get formCourseSection() { return <FormGroup>this.customForm.get('courseSectionId'); }
    get formStudyMode() { return <FormGroup>this.customForm.get('studyModeTypeId'); }
    get formOrgSession() { return <FormGroup>this.customForm.get('orgSessionId'); }
    get formFeeStructureList() { return <FormArray>this.customForm.get('feeStructureList'); }

    updateOrgSession(val) { this.formOrgSession.setValue(val); }

    populateFeePlanForm(data: FeePlan) {
        this.customForm.get('id').setValue(data.id);
        this.customForm.get('name').setValue(data.name);
        this.customForm.get('orgSessionId').setValue(data.orgSessionId);
        this.customForm.get('studyModeTypeId').setValue(data.studyModeTypeId);
        this.customForm.get('courseId').setValue(data.courseId);
        this.customForm.get('courseSectionId').setValue(data.courseSectionId);

        // this.customForm.get('orgTaskName').setValue(data.orgTaskName);
        // this.customForm.get('orgTaskId').setValue(data.orgTaskId);

        this.formFeeStructureList.controls.length = 0;
        (data.feeStructureList || []).map((r) => this.addNewRow(r));
    }

    initItemRows(data: FeeStructure) {
        const {
            id,
            amount, taxAmount,
            sortOrder,
            orgTaskId,
            feeTypeId, frequencyTypeId, depositDurationType, defaultDay, defaultMonth, orgTaskScheduleId,
            feeTypeName,
            voucherTypeId, voucherConfigId, totalTaxAmount, totalAmount, status
        } = data;
        const feeStructure = this.fb.group({
            id: [id || null],
            //feePlanId: [feePlanId || null],
            status: [ status || false ],
            feeTypeId: [feeTypeId || null, Validators.required],
            amount: [amount || null, Validators.required],
            taxAmount: [taxAmount || 0],

            sortOrder: [sortOrder || null],

            voucherTypeId: [voucherTypeId, Validators.required],
            //orgTaskId: [orgTaskId, Validators.required],
            voucherConfigId: [voucherConfigId],
            //orgTaskScheduleId: [orgTaskScheduleId],
            frequencyTypeId: [frequencyTypeId, Validators.required],
            depositDurationType: [depositDurationType],
            defaultDay: [defaultDay],
            defaultMonth: [defaultMonth],

            feeTypeName: [feeTypeName],
            totalTaxAmount: [totalTaxAmount],
            totalAmount: [{value: totalAmount, disabled: false }]
        });
        return feeStructure;
    }

    addNewRow(data) {
        this.formFeeStructureList.push(this.initItemRows(data));
    }

    deleteRow(index: number) {
        this.formFeeStructureList.removeAt(index);
    }

    updateStudyMode(val) {
        this.formStudyMode.setValue(val);
        this.formCourse.reset();
        this.formCourseSection.reset();
    }

    updateCourseSection(courseSectionId) {
        this.formCourseSection.setValue(courseSectionId);
    }

    updateCourse(courseId) {
        this.formCourse.setValue(courseId);
        this.formCourseSection.reset();
    }
}