import {FormBuilder} from "@angular/forms";
import {Component, EventEmitter, Output} from "@angular/core";
import {GlobalSearchQueryOptions} from "../domains/global-search-lookup";
import {GlobalSearchLookupService} from "../services/global-search-api.resolver";

@Component({
  selector:'app-filter',
  templateUrl: './templates/app-filter.html',
  standalone: false
})
export class AppFilterComponent {
  submitted: boolean = false;
  data: any = {};

  queryOption: any = new GlobalSearchQueryOptions();
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  orgSessionOptions: any = {title: 'Session', label: 'name', key: 'sessionId', listKey: 'id'};
  studyModeOptions: any = {title: 'Study Mode', label: 'name', key: 'studyModeId', listKey: 'id'};

  constructor(public fb: FormBuilder, public service: GlobalSearchLookupService) {}

  onSubmit(){}

  populateCourse(data){
    this.queryOption.courseId = data.parentId;
    this.queryOption.courseSectionId = data.childId;
  }

  populateClass(data){
    this.queryOption.classId = data.parentId;
    this.queryOption.classSectionId = data.childId;
  }
}
