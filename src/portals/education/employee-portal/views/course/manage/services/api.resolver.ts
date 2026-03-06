import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import  { OrgResourceService } from "@app-global"
import {CourseLookup, CourseLookupSerializer} from "../domains/course.lookup";
import {StudyLevelType} from "../domains/study-type.serializer";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {map, tap} from "rxjs";
import {StudyTypeListComponent} from "../components/study-type-list/study-type-list.component";
import {EduPluginFactory} from "../../CoursePopup";

@Injectable()
export class CourseModuleAPIResolver extends OrgResourceService<CourseLookup> implements Resolve<any> {
  masterType: CourseLookup;
  public listData: any = { title: 'Master types', navList: [] };
    constructor(public override injector: Injector, private popupService: SharedService, private pluginFactory: EduPluginFactory) {
        super(injector, 'lookup/course-master-type', new CourseLookupSerializer());
    }

    get isRootUser(){ return this.isRootUser; }
    //get countryId(){ return this.orgCountryId; }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results.data;
    };
    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

  getCourseCountByLevelId(studyLevel: StudyLevelType, cb){
    const { id, parentId } = studyLevel;
    const modelCall = this.getCourseByStudylevelId(id, parentId).toPromise().then(cb);
  }

    private getCourseByStudylevelId(studylevelId, studyLevelParentId){
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}lookup/course/${studylevelId}/${studyLevelParentId || 0}/count`, this.requestHeaders)
            .pipe(
                map((resp: {  data: any}) => resp.data),
                tap((error)=>{ this.handleError(error, () => this.getCourseByStudylevelId(studylevelId, studyLevelParentId)) })
            );
    }

    /*byCountry(countryId){
      return this.httpClient
        .get(`${this.configService.baseApiUrl}lookup/course-master-type-by-country/${countryId}`, this.requestHeaders)
        .pipe(
          map((resp: {  data: any}) => resp.data),
          tap(
            (error)=>{ this.handleError(error, () => this.byCountry(countryId)) }
          )
        );
    }
    showCoursePopup(inputData: any, headerOptions, cb){
        const popup = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        let modal$ = this.popupService.showCustomPopup(EditCourseComponent, popup, inputData);
        modal$.then((resp)=>{
            this.popupService.destroy();
            cb();
        }, (err)=>{
            this.popupService.destroy();
        });
    }

    showMasterCoursePopup(inputData: any, headerOptions, cb){
        const popup = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        let modal$ = this.popupService.showCustomPopup(CreateMasterCourseComponent, popup, inputData);
        modal$.then((resp)=>{
            this.popupService.destroy();
            cb();
        }, (err)=>{
            this.popupService.destroy();
        });
    }*/

    showAllStudyTypes(inputData: any, headerOptions, cb){
        const popup = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };

        const success = (resp: any)=>{
            this.popupService.destroy();
            cb();
        };
        const failure = ()=>{
            this.popupService.destroy();
        };
        let modal$ = this.popupService.showCustomPopup(StudyTypeListComponent, popup, inputData);
        modal$.then(success, failure);
    }

    addCourse(inputData: any, headerOptions, cb)
    {
        const success = (resp: any) => { this.pluginFactory.destroy(); cb(); };
        const failure = (e) => { this.pluginFactory.destroy(); };

        this.pluginFactory.showCoursePopup(inputData, headerOptions).then(success, failure);
    }
}
