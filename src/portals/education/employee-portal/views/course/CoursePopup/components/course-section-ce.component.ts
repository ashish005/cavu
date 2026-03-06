import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output, TemplateRef, ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseLookup} from "../domain/course.lookup";
import {CourseLookupService} from "../services/api.resolver";
import {CourseSubjectForm} from "../forms/course-subject.form";
import {Course} from "../domain/course.serializer";

@Component({ standalone: false, selector: 'course-section-ce', templateUrl: './templates/course-section.html', styles: [`:host { display: contents;}`] })
export class CourseSectionCeComponent extends CourseSubjectForm implements OnInit
{
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() courseId: any;
  @Input() isMasterCourse: boolean;
  @Input() set data(val){
      this.populateData(val  ||  new Course());
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  lookup: CourseLookup;
  submitted: boolean = false;
  public errorMsg: string = '';

  constructor(public override fb: FormBuilder, private lookupService: CourseLookupService) {
    super(fb);
  }

    populateData(course: Course){
        let level = null;
        this.lookup = this.lookupService.masterType;
        this.populateSections(course.sections);
    }

  ngOnInit(){}
}
