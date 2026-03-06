import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrgClass} from "../domains/class.serializer";

export class OrgClassForm {
    customFrom: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customFrom = this.fb.group({
            name: ['', Validators.required],
            courseId: [null],
            courseSectionId: [null],
            studyModeTypeId: [null, Validators.required],
            classSections: this.fb.array([]),

            classTeacherId: [null],
            classTeacherName: [null]
        });
    }

    updateClassForm(data: OrgClass){
        this.customFrom.get('name').setValue(data.name);
        this.customFrom.get('courseId').setValue(data.courseId);
        this.customFrom.get('courseSectionId').setValue(data.courseSectionId);
        this.customFrom.get('studyModeTypeId').setValue(data.studyModeTypeId);
        this.customFrom.get('classTeacherId').setValue(data.classTeacherId);
        this.customFrom.get('classTeacherName').setValue(data.classTeacherName);

        this.formClassSection.controls.length = 0;
        (data.classSections || []).map((r)=> { this.addNewRow(r); });
    }

    populateClassSection(data) {
        return this.fb.group({
            id: [ (data)?data.id:null],
            name: [ (data)?data.name:null, Validators.required]
        });
    }

    get formCourse() { return <FormGroup>this.customFrom.get('courseId'); }
    get formCourseSection() { return <FormGroup>this.customFrom.get('courseSectionId'); }
    get formStudyModeType() { return <FormGroup>this.customFrom.get('studyModeTypeId'); }
    get formClassTeacherId() { return <FormGroup>this.customFrom.get('classTeacherId'); }
    get formClassTeacherName() { return <FormGroup>this.customFrom.get('classTeacherName'); }
    get formClassSection(){ return <FormArray>this.customFrom.get('classSections'); }

    updateStudyMode(val){ this.formStudyModeType.setValue(val);  }
    updateCourse(val){ this.formCourse.setValue(val); }
    updateCourseSection(val){ this.formCourseSection.setValue(val); }

    updateReportedToId(val){
        const { id, orgUserId, userId, name} = val || {};
        this.formClassTeacherId.setValue(id, { emitEvent: false});
        this.formClassTeacherName.setValue(name, { emitEvent: false});
    }

    addNewRow(data) { this.formClassSection.push(this.populateClassSection(data)); }

    deleteRow(index: number) { this.formClassSection.removeAt(index); }

    // convenience getter for easy access to form fields
    get f() { return this.customFrom.controls; }
}