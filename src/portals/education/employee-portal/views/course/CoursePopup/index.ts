import {CommonModule} from "@angular/common";
import {Injectable, Injector, Input, ModuleWithProviders, NgModule} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, GlobalModule, SharedService} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";
import {CourseLayout} from "./layout/layout";
import {CourseLookupService} from "./services/api.resolver";
import {CourseService} from "./services/course.service";
import {EditCourseComponent} from "./components/course-ce.component";
import {CourseSubjectCeComponent} from "./components/course-subject-ce.component";
import {CourseSectionCeComponent} from "./components/course-section-ce.component";

@Injectable()
export class EduPluginFactory {
    sharedService: SharedService;
    resolver: CourseLookupService;
    courseService: CourseService;
    constructor(public injector: Injector) {
        this.sharedService = injector.get(SharedService);
        this.resolver = injector.get(CourseLookupService);
        this.courseService = injector.get(CourseService);
    }

    async showCoursePopup(input: any, header: any){
       const popupOptions = {
            header: header || { text: `Course`, desc: `Course` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_100
        };
        if(input.id) {
            const resp = await this.courseService.read(input.id).toPromise();
            input.data = resp.data;
        }
        return this.resolver.resolve().then(()=> this.sharedService.showCustomPopup(CourseLayout, popupOptions, input));
    }
    destroy(){ this.sharedService.destroy(); }
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GlobalModule
    ],
    declarations: [CourseLayout, EditCourseComponent, CourseSubjectCeComponent, CourseSectionCeComponent],
    providers: [EduPluginFactory, CourseLookupService, CourseService],
    exports: []
})
export class EduPluginModule {}