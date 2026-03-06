import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

export class CourseSubjectForm {
    customForm: FormGroup;
    activeSection: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            sections: this.fb.array([])
        });
    }

    initSectionRows(data) {
        const section: FormGroup = this.fb.group(<any>{
            id: [ (data)?data.id: null],
            name: [ (data)?data.name:'', Validators.required],
            code: [(data)?data.code:'', Validators.required],
            subjects: this.fb.array([])
        });
        (data.subjects || []).map((r) => {
            (<FormArray>section.get('subjects')).push(this.initSubjectRows(r));
        });
        return section;
    }

    initSubjectRows(data) {
        return this.fb.group(<any>{
            id: [ (data)?data.id: null],
            name: [ (data)?data.name:'', Validators.required],
            code: [(data)?data.code:'', Validators.required]
        });
    }


    get sectionsForm(): FormArray<FormGroup>{
        return this.customForm.get('sections') as FormArray<FormGroup>;
    }

    addNewSectionRow(data) {
        this.sectionsForm.push(this.initSectionRows(data));
    }

    deleteSectionRow(index: number) {
        this.sectionsForm.removeAt(index);
    }

    public populateSections(data) {
        this.sectionsForm.controls.length = 0;
        (data || []).map((r) => this.addNewSectionRow(r));
    }

    addSubject() {
        (<FormArray>this.activeSection.get('subjects')).push(this.initSubjectRows({}));
    }
}