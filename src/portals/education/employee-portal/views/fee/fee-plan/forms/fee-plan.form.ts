import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FeePlan} from "../domains/fee-plan.serializer";
import {FeeStructure} from "../domains/fee-structure.serializer";

export class FeePlanForm {
    customForm: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group(<any>{
            id: [null],
            name: [null, Validators.required],
            orgSessionId: [null, Validators.required],
            studyModeTypeId: [null, Validators.required],
            levelTypeId: [null, Validators.required],
            courseId: [null, Validators.required],
            courseSectionId: [null, Validators.required],
            feeStructureList: this.fb.array([])
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
    get formCourse() { return <FormGroup>this.customForm.get('courseId'); }
    get formCourseSection() { return <FormGroup>this.customForm.get('courseSectionId'); }
    get formStudyMode() { return <FormGroup>this.customForm.get('studyModeTypeId'); }
    get formStudyLevel() { return <FormGroup>this.customForm.get('levelTypeId'); }
    get formOrgSession() { return <FormGroup>this.customForm.get('orgSessionId'); }
    get formFeeStructureList(): FormArray<FormGroup> { return this.customForm.get('feeStructureList') as FormArray<FormGroup>; }

    updateOrgSession(val) { this.formOrgSession.setValue(val); }

    populateFeePlanForm(data: FeePlan) {
        this.customForm.get('id').setValue(data.id);
        this.customForm.get('name').setValue(data.name);
        this.customForm.get('orgSessionId').setValue(data.orgSessionId);
        this.customForm.get('studyModeTypeId').setValue(data.studyModeTypeId);
        this.customForm.get('levelTypeId').setValue(data.levelTypeId);
        this.customForm.get('courseId').setValue(data.courseId);
        this.customForm.get('courseSectionId').setValue(data.courseSectionId);

        this.formFeeStructureList.controls.length = 0;
        (data.feeStructureList || []).map((r) => this.addNewRow(r));
    }

    initItemRows(data: FeeStructure) {
        const {
            id,
            amount,
            sortOrder,
            orgTaskId,
            rate,
            feeTypeId, frequencyTypeId, depositDurationType, defaultDay, defaultMonth,
            name,
            voucherTypeId, voucherConfigId, isActive
        } = data;
        const tax: any = (rate * amount) / 100;

        const taxAmount: any = tax.toFixed(2);
        const totalAmount: any = parseFloat(<any>amount) + tax;
        const feeStructure = this.fb.group({
            id: [id || null],
            //feePlanId: [feePlanId || null],
            isActive: [ isActive || false ],
            feeTypeId: [feeTypeId || null, Validators.required],
            amount: [amount || null, Validators.required],
            taxAmount: [taxAmount || 0],
            rate: [rate || 0],

            sortOrder: [sortOrder || null],
            // orgTaskId: [orgTaskId],
            voucherTypeId: [voucherTypeId, Validators.required],
            voucherConfigId: [voucherConfigId],
            frequencyTypeId: [frequencyTypeId, Validators.required],
            depositDurationType: [depositDurationType],
            defaultDay: [defaultDay],
            defaultMonth: [defaultMonth],

            name: [name],
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

    updateStudyLevel(val) {
        this.formStudyLevel.setValue(val);
    }

    updateCourseSection(courseSectionId) {
        this.formCourseSection.setValue(courseSectionId);
    }

    updateCourse(courseId) {
        this.formCourse.setValue(courseId);
        this.formCourseSection.reset();
    }
}