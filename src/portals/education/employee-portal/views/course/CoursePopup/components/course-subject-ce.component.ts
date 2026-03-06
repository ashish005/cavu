import {
  Component,
  EventEmitter,
  Input, OnInit
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CourseSectionService} from "../services/course.service";

@Component({
    standalone: false,
    selector: 'course-subject-ce',
    providers: [CourseSectionService],
    templateUrl: './templates/course-subject.html', styles: [`:host { display: contents;}`]
})
export class CourseSubjectCeComponent implements OnInit
{
  submitted: boolean;
  @Input() customForm: FormGroup;
  constructor(public fb: FormBuilder, public service: CourseSectionService) { }
  ngOnInit(){}

    get subjectForm(): FormArray<FormGroup> { return this.customForm.get('subjects') as FormArray<FormGroup>; }

    addSubject(data?) { this.subjectForm.push(this.initSubjectRows(data || {})); }
    removeSubject(index: number) { this.subjectForm.removeAt(index); }

    public populateSections(data) {
        this.subjectForm.controls.length = 0;
        (data.subjects || []).map((r) => this.addSubject(r));
    }

    initSubjectRows(data) {
        return this.fb.group(<any>{
            id: [ data?.id || null],
            name: [data?.name, Validators.required],
            code: [data?.code, Validators.required]
        });
    }

    submitForm(){
        if(this.customForm.invalid){ return; }

        const data = this.customForm.getRawValue();

        this.submitted = true;
        const onSuccess = (resp) => {
            this.submitted = false;
            this.populateSections(resp.data);
        };
        const onError = (resp) => { this.submitted = false; };
        this.service.update(data.id, data).subscribe(onSuccess, onError);
    }
}
