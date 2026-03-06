import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CourseModuleAPIResolver } from "../services/api.resolver";
import {CourseService} from "../services/course.service";
import {ACTION_ENUM} from "@app-global";

class CourseForm {
  customForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.customForm = this.fb.group({
      name: ['', Validators.required],
      abbreviation: [''],
      studyLevelId: [null, [Validators.required]],
      studyProgramId: [null, [Validators.required]],
      studyDegreeId: [null, [Validators.required]],
      studyStreamId: [null, [Validators.required]],
      eligibility: [null, Validators.required],
      durationType: [null, Validators.required],
      duration: [null, Validators.required],
      durationTerm: [null],
      countryId: [null],
      sections: this.fb.array([]),
      studyModes: this.fb.array([])
    });
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



  get formStudyLevel() {
    return <FormGroup>this.customForm.get('studyLevelId');
  }

  get formStudyProgram() {
    return <FormGroup>this.customForm.get('studyProgramId');
  }

  get formStudyDegree() {
    return <FormGroup>this.customForm.get('studyDegreeId');
  }

  get formStudyStream() {
    return <FormGroup>this.customForm.get('studyStreamId');
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
    let _count: number = parseInt(this.customForm.get('duration').value, 10) || 1;

    let _data = [];
    if(this.isYearlyCourse && _count>0){
      const _durationTermCount: number = (this.formStudyDurationTerm.value)?parseInt(this.formStudyDurationTerm.value, 10): 1;
      const _total = _count*_durationTermCount;
      for(let i=0; i< _total; i++){
        _data.push({ name: `${i+1}${i+1}`, code: `${i+1}${i+1}`});
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

@Component({ standalone: false, templateUrl: './templates/create-master-course.html' })
export class CreateMasterCourseComponent extends CourseForm implements OnInit{
  @Input() id: any;
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  submitted: boolean = false;
  activeSection: any;
  constructor(public override fb: FormBuilder, public apiResolver: CourseModuleAPIResolver, public service: CourseService) {
    super(fb);
  }

  ngOnInit(){
    if(this.id) {
      this.service.read(this.id).subscribe((resp)=>{
        this.populateData(resp.data || {});
      });
    }
  }

  populateData(course){
    this.customForm.get('name').setValue(course.name);
    this.customForm.get('abbreviation').setValue(course.abbreviation);
    this.updateStudyLevel(course.studyLevelId);
    this.customForm.get('studyLevelId').setValue(course.studyLevelId);
    this.customForm.get('studyProgramId').setValue(course.studyProgramId);
    this.customForm.get('studyDegreeId').setValue(course.studyDegreeId);
    this.customForm.get('studyStreamId').setValue(course.studyStreamId);
    this.customForm.get('eligibility').setValue(course.eligibility);
    this.customForm.get('duration').setValue(course.duration);
    this.customForm.get('durationType').setValue(course.durationType);
    this.customForm.get('durationTerm').setValue(course.durationTerm);
    this.customForm.get('countryId').setValue(course.countryId);

    const studyModes = (course.studyModes && course.studyModes.length > 0) ? [...course.studyModes] : [];
    this.updateStudyMode(studyModes);
    this.populateSections(course.sections);

  }

  updateStudyLevel(val){
    this.formStudyLevel.setValue(val);
    this.formStudyProgram.setValue(null);
    this.formStudyProgram.enable();

    this.formStudyDegree.setValue(null);
    this.formStudyDegree.enable();

    this.formStudyStream.setValue(null);
    this.formStudyStream.enable();

    this.formEligibility.setValue(null);
    this.formEligibility.enable();

    this.formStudyDurationTerm.setValue(null);
    this.formStudyDurationTerm.enable();

    this.apiResolver.masterType.updateStudyProgramBasedOnStudyLevel(val);

    const master = this.apiResolver.masterType;
    if(master.filteredStudyProgram.length == 1){
      this.formStudyProgram.setValue(master.filteredStudyProgram[0].id);
      this.formStudyProgram.disable();
    }

    if(master.studyDegreeList.length == 1){
      this.formStudyDegree.setValue(master.studyDegreeList[0].id);
      this.formStudyDegree.disable();
    }

    if(master.studyStreamList.length == 1){
      this.formStudyStream.setValue(master.studyStreamList[0].id);
      this.formStudyStream.disable();
    }

    if(master.eligibilityList.length == 1){
      this.formEligibility.setValue(master.eligibilityList[0].id);
      this.formEligibility.disable();
    }

    if(master.durationTermList.length == 1){
      this.formStudyDurationTerm.setValue(master.durationTermList[0].id);
      this.formStudyDurationTerm.disable();
    }
  }

  updateSubjects($event){
    this.updateCourse(this.customForm);
  }

  showSubjects(section: FormGroup){
    this.activeSection = section;
  }

  updateCourse(course: any){
    if(!course.valid){
      return;
    }
    const data = course.getRawValue();
    //data.countryId = this.orgCountryId;
    //
    this.submitted = true;
    const onSuccess = (resp) => {
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const onError = (resp) => {
      this.submitted = false;
    };
    if(this.id){
      this.service.update(this.id, data).subscribe(onSuccess, onError);
    } else {
      this.service.create(data).subscribe(onSuccess, onError);
    }
  }
}
