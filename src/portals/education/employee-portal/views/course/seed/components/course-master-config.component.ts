import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CourseSeederAPIResolver} from "../services/api.resolver";


@Component({
  standalone: false,
  selector:'course-master-config',
  templateUrl: './templates/course-master-config.html',
  styles: [`:host{ display: contents; }`]
})
export class CourseMasterConfigComponent{
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  studyLevel: any;

  constructor(public apiResolver: CourseSeederAPIResolver) {}

  showStudyLevelDetails(data){
    this.studyLevel = data;
  }
}
