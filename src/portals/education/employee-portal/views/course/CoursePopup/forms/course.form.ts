import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

export class CourseForm {
    customForm: FormGroup;
    activeSection: FormGroup;
    constructor(public fb: FormBuilder) {
        this.customForm = this.fb.group({
            name: ['', Validators.required],
            abbreviation: [''],
            studyLevelId: [null, [Validators.required]],
            studyDegreeId: [null, [Validators.required]],
            studyProgramId: [null, [Validators.required]],
            studyStreamId: [null, [Validators.required]],
            eligibility: [null, Validators.required],
            durationType: [1, Validators.required],
            duration: [1, Validators.required],
            durationTerm: [1],
            // countryId: [null, Validators.required],
            // orgUnitId: [null, Validators.required],
            sections: this.fb.array([]),
            studyModes: this.fb.array([])
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

    get formStudyStream() {
        return <FormGroup>this.customForm.get('studyStreamId');
    }

    get formStudyLevel() {
        return <FormGroup>this.customForm.get('studyLevelId');
    }

    get formStudyProgram() {
        return <FormGroup>this.customForm.get('studyProgramId');
    }

    get formStudyDegree() {
        return <FormGroup>this.customForm.get('studyDegreeId');
    }

    get formEligibility() {
        return <FormGroup>this.customForm.get('eligibility');
    }

    get formStudyDuration() {
        return <FormGroup>this.customForm.get('durationType');
    }

    get formStudyDurationTerm() {
        return <FormGroup>this.customForm.get('durationTerm');
    }

    get formStudyModes():FormArray<FormControl> {
        return this.customForm.get('studyModes') as FormArray<FormControl>;
    }

    get sectionsForm(): FormArray<FormGroup> {
        return this.customForm.get('sections') as FormArray<FormGroup>;
    }

    updateStudyStream(val){
        this.formStudyStream.setValue(val);
    }

    updateStudyDegree(val){
        this.formStudyDegree.setValue(val);
    }

    updateStudyProgram(val){
        this.formStudyProgram.setValue(val);
    }

    updateStudyMode(item){
        this.formStudyModes.controls.length = 0;
        (item || []).forEach((val: number) => {
            this.formStudyModes.push(this.fb.control(val));
        });

        if(!item || item.length === 0){
            this.formStudyModes.setValue([]);
        }
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

    //Validations
    get isYearlyCourse(){
        return this.formStudyDuration.value === 1;
    }

    showSubjects(section: FormGroup){
        this.activeSection = section;
    }

    addSubject() {
        (<FormArray>this.activeSection.get('subjects')).push(this.initSubjectRows({}));
    }
}