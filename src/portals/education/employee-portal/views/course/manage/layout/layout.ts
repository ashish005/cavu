import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseModuleAPIResolver} from "../services/api.resolver";
import {StudyDegreeType, StudyLevelType} from "../domains/course.lookup";
import {Course} from "../domains/course.serializer";
import {ViewExtender} from "@app-global";
import {COURSE_ENUM, CourseListInfo, CourseListInfoQueryOptions} from "../domains/course-list-info.serializer";
import {CourseListInfoService} from "../services/course.service";

@Component({
    standalone: false,
    templateUrl: './layout.html'
})
export class CourseMasterLayout extends ViewExtender<Course> implements OnInit{
    override coreState: CourseListInfoQueryOptions = new CourseListInfoQueryOptions();
    studyLevel: StudyLevelType;
    constructor(public override service: CourseListInfoService, public apiResolver: CourseModuleAPIResolver,
                private router: Router, public override activatedRoute: ActivatedRoute) {
       super(activatedRoute, service);
    }

    ngOnInit() {
        // for(let item of this.apiResolver?.masterType?.studyLevel ||  []) {
        //     this.apiResolver.getCourseCountByLevelId(item, (data) => {
        //         const { masterCourseCount, orgCourse } = data;
        //         const { groupBy, orgCourseCount } = orgCourse;
        //         item.synchOtherDetails(masterCourseCount, groupBy, orgCourseCount);
        //     });
        // }
        this.coursesViewTypeChange(false);
    }

    showAllStudyTypes(){
        const inputData: any = { id: null, data: null };
        const headerOptions = {text: 'Study Types', desc: 'Current applied Organization Study Types' };
        this.apiResolver.showAllStudyTypes(inputData, headerOptions, ()=>{ });
    }

    coursesViewTypeChange(isMasterView)
    {
        this.coreState.viewType = (this.apiResolver.isRootUser || isMasterView) ? COURSE_ENUM.MASTER: COURSE_ENUM.SLAVE;
        this.populateGrid();
    }

    /*manageConfig(){
      const popup = {
        header: { text: `Course Config`, desc: ` Course` },
        aside: ASIDE_CLASS.RIGHT,
        size: ASIDE_SIZE.W_75
      };

      const inputData: any = {
        id: null,
        data: null,
        actionType: ACTION_ENUM.SHOW
      };

      let modal$ = this.popupService.showCustomPopup(CourseMasterConfigComponent, popup, inputData);
      modal$.then((resp)=>{
        this.popupService.destroy();
      }, (err)=>{
        this.popupService.destroy();
      });
    }*/

    /*showSeedCourse(){
      const inputData: any = {
        id: null,
        data: null,
        actionType: ACTION_ENUM.SHOW
      };
      this.showSeedCoursePopup(inputData);
    }

    showSeedCoursePopup(inputData: any){
      const popup = {
        header: { text: `${inputData.actionType} Course`, desc: `${inputData.actionType} Course` },
        aside: ASIDE_CLASS.RIGHT,
        size: ASIDE_SIZE.W_75
      };

      let modal$ = this.popupService.showCustomPopup(SeedCouresComponent, popup, inputData);
      modal$.then((resp)=>{
        this.popupService.destroy();
      }, (err)=>{
        this.popupService.destroy();
      });
    }*/

    onStudyLevelChange(level: StudyLevelType){
        this.studyLevel = level;
        this.apiResolver.masterType.updateStudyProgramBasedOnStudyLevel(level.id);
        this.coreState.studyLevelId = level.id;

        const {
            filteredStudyProgram, studyDegreeList, studyStreamList, eligibilityList, durationTermList
        } = this.apiResolver.masterType;
        this.setDegreeType(studyDegreeList[0])
    }

    setDegreeType(degreeType: any){
        this.coreState.degreeTypeId = degreeType?.id;
        this.updateGrid(this.coreState);
    }

    newCourse(){
        const inputData: any = { id: null, data: null };
        const headerOptions = { text: `${inputData.actionType} Course`, desc: `${inputData.actionType} Course` };
        //this.apiResolver.showCoursePopup(inputData, headerOptions, ()=>{ this.populateGrid(); });
    }

    editMasterCourse(course){
        const inputData: any = { id: course.id, data: course };
        const headerOptions = { text: `${inputData.actionType} Course`, desc: `${inputData.actionType} Course` };
        // this.apiResolver.showMasterCoursePopup(inputData, headerOptions,()=>{
        //     this.populateGrid();
        // });
    } /**/

    /*editOrgCourse(course){
        const inputData: any = { id: course.id, data: course };
        const headerOptions = { text: `${inputData.actionType} Course`, desc: `${inputData.actionType} Course` };
        this.apiResolver.showCoursePopup(inputData, headerOptions, ()=>{ this.populateGrid(); });
    }*/
    applyCourseToOrganization(course: CourseListInfo){
        // const globalFilter = this.coreService.globalFilter();
        // const inputData: any = {
        //   id: course.id,
        //   isMasterCourse: course.isMasterCourse,
        //   orgUnitId: globalFilter.orgUnitId,
        //   data: course
        // };
        // this.showCoursePopup(inputData, { text: `${inputData.actionType} Course`, desc: `${inputData.actionType} Course` });
    }

    addCourse()
    {
        const inputData: any = { id: null, isMasterCourse: false };
        this.apiResolver.addCourse(inputData, { text: `Course`, desc: 'Course' }, ()=>{ this.populateGrid(); });
    }
    editOrgCourse(course){
        const inputData: any = { id: course.id, isMasterCourse: course?.isMasterCourse };
        const headerOptions = { text: `${course.name} Course`, desc: `${course.name} Course` };
        this.apiResolver.addCourse(inputData, headerOptions, ()=>{ this.populateGrid(); });
    }
    showCourseDetails(c){}
}