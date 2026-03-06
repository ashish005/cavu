import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {OrgClassService} from "../services/class.service";
import {OrgClassModuleAPIResolver} from "../services/api-resolver.service";
import { CourseLookup } from "../domains/lookup";
import {pairwise, startWith} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {OrgClassForm} from "../forms/org-class.form";

@Component({
  standalone: false,
  templateUrl: './templates/org-class-create-edit.html',
  styles: [`:host{ display: contents; }`]
})
export class OrgClassCreateEditComponent extends OrgClassForm implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: any;
  @Input() set data(val: any) { this.updateClassForm(val || {}); };

  submitted: boolean = false;
  public courses: Array<CourseLookup> = [];

  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD};
  constructor(public override fb: FormBuilder, public apiResolver: OrgClassModuleAPIResolver, protected service: OrgClassService) {
    super(fb);

      /*const itemStudyModeFormValueChange = ([prev, next]: [any, any]) =>
      {
          if(prev != next) {
              this.courses = this.apiResolver.masterType.getCourseByStudyMode(next);
          } else {
              this.courses = this.apiResolver.masterType.course;
          }
      };
      this.formStudyModeType.valueChanges.pipe(startWith(null as string), pairwise()).subscribe(itemStudyModeFormValueChange);*/
  }

  ngOnInit(): void {}

  onSubmit(form) {
    // stop here if form is invalid
    if (form.invalid) {
      return;
    }

    const data = this.customFrom.getRawValue();
    this.submitted = true;

    const success = (resp: any) => {
        this.submitted = false;
        this.onOk.emit(true);
    };
    const failure = (resp: any) => {};

    if(this.id) {
      this.service.update(this.id, data).subscribe(success, failure);
    } else {
      this.service.create(data).subscribe(success, failure);
    }
  }
}
