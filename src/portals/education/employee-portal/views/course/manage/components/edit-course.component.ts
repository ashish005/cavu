import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output, TemplateRef, ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CourseModuleAPIResolver} from "../services/api.resolver";
import {CourseService} from "../services/course.service";
import {ACTION_ENUM} from "@app-global";
import {Course} from "../domains/course.serializer";

class CourseForm {
    customForm: FormGroup;
    activeSection: any;
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
            //countryId: [null, Validators.required],
            //orgUnitId: [null, Validators.required],
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

    get sectionsForm(): FormArray<FormGroup>{
        return this.customForm.get('sections') as FormArray<FormGroup>;
    }

    // get formCountryId(){
    //     return <FormGroup>this.customForm.get('countryId');
    // }

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
        (item || []).forEach((val: any) => {
            this.formStudyModes.push(this.fb.control(val));
        });

        if(!item || item.length === 0){
            this.formStudyModes.setValue([]);
        }
    }

    // updateCountryId(val){
    //     this.formCountryId.setValue(val);
    // }

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
        let _count: number = parseInt(this.customForm.controls['duration'].value, 10) || 1;

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

    showSubjects(section: FormGroup){
        this.activeSection = section;
    }

    populateData(course: Course){
        this.customForm.get('name').setValue(course.name);
        this.customForm.get('abbreviation').setValue(course.abbreviation);

        this.customForm.get('studyLevelId').setValue(course.studyLevelId);
        this.customForm.get('studyProgramId').setValue(course.studyProgramId);
        this.customForm.get('studyDegreeId').setValue(course.studyDegreeId);
        this.customForm.get('studyStreamId').setValue(course.studyStreamId);
        this.customForm.get('eligibility').setValue(course.eligibility);
        this.customForm.get('duration').setValue(course.duration);
        this.customForm.get('durationType').setValue(course.durationType);
        this.customForm.get('durationTerm').setValue(course.durationTerm);
        //this.customForm.get('countryId').setValue(course.countryId);
        //this.customForm.controls.orgUnitId.setValue(this.orgId);// required
        if(!course.sections.length){
            this.GenerateSections();
        } else {
            this.populateSections(course.sections);
            if(course.sections && course.sections.length == 1){
                this.showSubjects(this.sectionsForm.at(0) as FormGroup);
            }
        }
    }
}

@Component({
    standalone: false,
  templateUrl: './templates/edit-course.html',
  styles: [`:host{ display: contents; }`]
})
export class EditCourseComponent extends CourseForm implements OnInit{
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() isMasterCourse: boolean;
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  submitted: boolean = false;
  public errorMsg: string = '';

  constructor(public override fb: FormBuilder,  public apiResolver: CourseModuleAPIResolver, public service: CourseService) {
    super(fb);
  }

  ngOnInit(){
    if(this.id) {
      this.service.read(this.id).subscribe((resp)=>{
        this.populateData(resp.data || {});
      });
    }
  }

  override populateData(course){
    super.populateData(course);
    let level = this.apiResolver.masterType.getStudyLevelById(course.studyLevelId);
    // override for master data
    // if(this.isMasterCourse){
    //   level = this.apiResolver.masterType.getOrgStudyLevelByParentId(course.studyLevelId) || { id: null };
    //   this.customForm.controls.studyLevelId.setValue(level.id);
    // }
    // else {
    //     level = this.apiResolver.masterType.getStudyLevelById(course.studyLevelId) || { parentId: null };
    // }
    this.updateFormByMasterLookupLevelId(level.id);
  }

  updateStudyLevel(studyLevelId){
    this.formStudyLevel.setValue(studyLevelId);
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

    this.updateFormByMasterLookupLevelId(studyLevelId);
  }

  updateFormByMasterLookupLevelId(levelId){
    this.apiResolver.masterType.updateStudyProgramBasedOnStudyLevel(levelId);

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

  updateCourse(course: any){
    if(course.valid){
      if(!this.formStudyModes.length) {
        this.errorMsg = "Please select study mode";
        setTimeout(() => {
          this.errorMsg = "";
        }, 3000);
        return;
      }
    }

    const data = course.getRawValue();
    //data.countryId = data.countryId || this.apiResolver.countryId;
    if(this.isMasterCourse){
      this.cloneAndCreateOrgCourse(data);
    } else {
      this.updateOrgCourse(data);
    }
  }

  updateOrgCourse(data: any){
    this.submitted = true;
    const onSuccess = (resp) => {
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const onError = (resp) => {
      this.submitted = false;
    };
    if(!this.id){
        this.service.create(data).subscribe(onSuccess, onError);
    } else {
        this.service.update(this.id, data).subscribe(onSuccess, onError);
    }
  }

  cloneAndCreateOrgCourse(data: any){
    this.submitted = true;
    const onSuccess = (resp) => {
      this.submitted = false;
      this.onOk.emit(resp);
    };

    const onError = (resp) => {
      this.submitted = false;
    };
    // when adding a course to institute from master courses
    (data.sections|| []).map((item, index)=>{
      delete item.id;
      (item.subjects || []).map((subject)=> {
        delete subject.id;
      });
    });
    data.parentId = this.id;
    //data.orgUnitId = this.orgId;

    this.service.create(data).subscribe(onSuccess, onError);
  }
}
