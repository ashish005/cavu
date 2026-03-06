import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

export class CourseCEFormFactory {
  customForm: FormGroup;

  //public selectedStudyModes: Array<any> = []; //Special case - multi select array

  constructor(public fb: FormBuilder) {

    this.customForm = this.fb.group({
      name: ['', Validators.required],
      abbreviation: [''],
      studyDegreeId: [null, [Validators.required]],
      studyLevelId: [null, [Validators.required]],
      studyProgramId: [null, [Validators.required]],
      studyStreamId: [null, [Validators.required]],
      eligibility: [null, Validators.required],
      durationType: [null, Validators.required],
      duration: [null, Validators.required],
      durationTerm: [null],
      countryId: ['', Validators.required],
      sections: this.fb.array([]),
      studyModes: this.fb.array([])
    });
  }

  disableControlsForAdmin(){
    this.customForm.controls.duration.disable();
  }

  initSectionRows(data) {
    const section: FormGroup = this.fb.group({
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
    return this.fb.group({
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

  get formStudyModes():FormArray {
    return <FormArray>this.customForm.get('studyModes');
  }

  get sectionsForm(){
    return <FormArray>this.customForm.get('sections');
  }

  get formCountryId(){
    return <FormGroup>this.customForm.get('countryId');
  }

  updateStudyStream(val){
    this.formStudyStream.setValue(val);
  }

  updateStudyLevel(val){
    this.formStudyLevel.setValue(val);
  }

  updateStudyDegree(val){
    this.formStudyDegree.setValue(val);
  }

  updateStudyProgram(val){
    this.formStudyProgram.setValue(val);
  }

  updateStudyQualification(val){
    this.formEligibility.setValue(val);
  }

  updateStudyDuration(val){
    this.formStudyDuration.setValue(val);
    if(this.isYearlyCourse){
      this.updateStudyDurationTerm('1');
    }
  }

  updateStudyDurationTerm(val){
    this.formStudyDurationTerm.setValue(val);
    this.populateNewSections(val);
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

  updateCountryId(val){
    this.formCountryId.setValue(val);
  }

  populateData(course){
    this.customForm.controls.name.setValue(course.name);
    this.customForm.controls.abbreviation.setValue(course.abbreviation);
    this.customForm.controls.studyDegreeId.setValue(course.studyDegreeId);
    this.customForm.controls.studyLevelId.setValue(course.studyLevelId);
    this.customForm.controls.studyStreamId.setValue(course.studyStreamId);
    this.customForm.controls.studyProgramId.setValue(course.studyProgramId);
    this.customForm.controls.eligibility.setValue(course.eligibility);
    this.customForm.controls.duration.setValue(course.duration);
    this.customForm.controls.durationType.setValue(course.durationType);
    this.customForm.controls.durationTerm.setValue(course.durationTerm);
    this.customForm.controls.countryId.setValue(course.countryId);

    const studyModes = (course.studyModes && course.studyModes.length > 0) ? [...course.studyModes] : [];
    this.updateStudyMode(studyModes);

    //this.selectedStudyModes = course.studyMode;

    this.populateSections(course.sections);
  }

  addNewSectionRow(data) {
    this.sectionsForm.push(this.initSectionRows(data));
  }

  deleteSectionRow(index: number) {
    this.sectionsForm.removeAt(index);
  }

  populateNewSections(sectionCount: number){
    this.GenerateSections();
  }

  public populateSections(data) {
    this.sectionsForm.controls.length = 0;
    (data || []).map((r) => this.addNewSectionRow(r));
  }

  GenerateSections(){
    let _count: number = parseInt(this.customForm.controls.duration.value, 10) || 1;

    let _data = [];
    if(this.isYearlyCourse && _count>0){
      const _durationTermCount: number = (this.formStudyDurationTerm.value)?parseInt(this.formStudyDurationTerm.value, 10): 1;
      const _total = _count*_durationTermCount;

      for(let i=0; i< _total; i++){
        _data.push(i);
      }
      this.populateSections(_data)
    }
    else {
      this.populateSections(_data);
    }
  }

  //Validations
  get isYearlyCourse(){
    return this.formStudyDuration.value === 1;
  }

  onDurationChanges(){
    this.GenerateSections();
  }
}
