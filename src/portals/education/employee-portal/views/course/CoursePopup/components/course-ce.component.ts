import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output, TemplateRef, ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseForm} from "../forms/course.form";
import {CourseService} from "../services/course.service";
import {pairwise, startWith} from "rxjs";
import {CourseLookup} from "../domain/course.lookup";
import {Course} from "../domain/course.serializer";
import {ACTION_ENUM} from "@app-global";
import {CourseLookupService} from "../services/api.resolver";

@Component({ standalone: false, selector: 'course-ce', templateUrl: './templates/course-ce.html', styles: [`:host { display: contents;}`] })
export class EditCourseComponent extends CourseForm implements OnInit
{
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() isMasterCourse: boolean;
  @Input() set data(val){
      this.populateData(val  ||  new Course());
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  lookup: CourseLookup;
  public get actionType() { return this.id ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  submitted: boolean = false;
  public errorMsg: string = '';

  constructor(public override fb: FormBuilder, public service: CourseService, private lookupService: CourseLookupService) {
    super(fb);
  }

  ngOnInit(){
    this.lookup = this.lookupService.masterType;
    const studyLevelChange=([prev, next]: [any, any])=>
    {
        if(prev != next)
        {
            this.formStudyLevel.setValue(next);
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

            this.lookup.updateStudyProgramBasedOnStudyLevel(next);

            const master = this.lookup;
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
    };

    this.formStudyLevel.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(studyLevelChange);
  }

  populateData(course: Course){
    this.customForm.get('name').setValue(course.name);
    this.customForm.get('abbreviation').setValue(course.abbreviation);

    this.customForm.get('studyLevelId').setValue(course.studyLevelId);
    this.customForm.get('studyProgramId').setValue(course.studyProgramId);
    this.customForm.get('studyDegreeId').setValue(course.studyDegreeId);
    this.customForm.get('studyStreamId').setValue(course.studyStreamId);
    this.customForm.get('eligibility').setValue(course.eligibility);
    this.customForm.get('duration').setValue(course.duration || 1);
    this.customForm.get('durationType').setValue(course.durationType || 1);
    this.customForm.get('durationTerm').setValue(course.durationTerm || 1);
    super.updateStudyMode(course.studyModes);
    // this.customForm.get('countryId').setValue(course.countryId);
    // this.customForm.get('orgUnitId').setValue(this.orgId);// required


    this.lookup = this.lookupService.masterType;
    let level = this.lookup.getStudyLevelById(course.studyLevelId);
    // override for master data
    // if(this.isMasterCourse){
    //   level = this.lookup.getOrgStudyLevelByParentId(course.studyLevelId) || { id: null };
    //   this.customForm.get('studyLevelId.setValue(level.id);
    // }
    // else {
    //   level = this.lookup.getStudyLevelById(course.studyLevelId) || { parentId: null };
    // }
    this.updateFormByMasterLookupLevelId(course.studyLevelId);
    if(!course.sections.length){
      this.GenerateSections();
    } else {
      this.populateSections(course.sections);
      if(course.sections && course.sections.length == 1){
        this.showSubjects(this.sectionsForm.at(0) as FormGroup);
      }
    }
  }

  updateFormByMasterLookupLevelId(levelId){
    this.lookup.updateStudyProgramBasedOnStudyLevel(levelId);

    const master = this.lookup;
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

  updateSubjects($event){ this.submitCourseForm(this.customForm); }

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

    studyDurationTermChange(){
        this.populateNewSections(this.formStudyDurationTerm.value);
    }
  onDurationChanges(){ this.GenerateSections(); }

    populateNewSections(sectionCount: number){ this.GenerateSections(); }
    GenerateSections(){
        let _count: number = parseInt(this.customForm.get('duration').value, 10) || 1;

        let _data = [];
        if(this.isYearlyCourse && _count>0){
            const _durationTermCount: number = (this.formStudyDurationTerm.value)?parseInt(this.formStudyDurationTerm.value, 10): 1;
            const _total = _count*_durationTermCount;
            const duration = this.lookup.durationTermList.find(r => r.id == this.formStudyDurationTerm.value);
            for(let i=0; i< _total; i++){
                if(duration)
                {
                    _data.push({ name: `${duration?.name}-${i+1}`, code: `${i+1}${i+1}`});
                } else {
                    _data.push({ name: `${i+1}${i+1}`, code: `${i+1}${i+1}`});
                }
            }
            this.populateSections(_data)
        }
        else {
            this.populateSections(_data);
        }
    }

  submitCourseForm(course: any){
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
    //If it has the parent id then it is already created for admin so only update admin courses
    //this.service.update(this.id, data).subscribe(onSuccess, onError);

      // const globalFilter = this.coreService.globalFilter();
      // if(!globalFilter.countryId){ return; }
      // data.countryId = globalFilter.countryId;

      if(this.id){
          this.service.update(this.id, data).subscribe(onSuccess, onError);
      } else {
          this.service.create(data).subscribe(onSuccess, onError);
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

    this.service.create(data).subscribe(onSuccess, onError);
  }
}
