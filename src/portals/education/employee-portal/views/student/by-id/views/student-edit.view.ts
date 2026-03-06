import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentService} from "../services/student.service";
import {StudentAPIResolver} from "../services/api.resolver";
import {StudentForm} from "../forms/student.form";

@Component({
  standalone: false,
  templateUrl: './templates/student-ce.html'
})
export class StudentEditView extends StudentForm implements OnInit {
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  submitted: boolean;
  isNew: boolean;
  orgStudentId: string; //Student or Employee user Id
  constructor(public override fb: FormBuilder,
              public router: Router,
              private activeRoute: ActivatedRoute,
              public service: StudentService,
              public apiResolver: StudentAPIResolver) {
    super(fb);
  }

  updateOrgImage(fileDocument: any){
    const successAction = (resp)=> {};
    const progressCb = ()=> {};
    this.service.updateUserProfile(this.orgStudentId, this.service.student.profileId, fileDocument, successAction, progressCb);
  }

  public get fileUrl(){
    return this.service.student?.profileUrl;
  }

  ngOnInit() {
    //this.isNew = this.activeRoute.snapshot.data.isNew;
    if (this.isNew) {
      const success = (regNoData) => this.customForm.get('registrationNo').setValue(regNoData.data);
      const failure = () => console.log('registration no not able to fetch');
      this.service.getRegistrationNo().subscribe(success, failure);
    } else {
      super.populateForm(this.service.student);
    }
  }


  updateOrgUser(data) {
    //stop here if form is invalid
    if (data.invalid) {
      this.submitted = false;
      return;
    }

    this.submitted = true;
    const performAction = (resp) => {
      this.submitted = false;
    };

    const createPerformAction = (resp) => {
      this.submitted = false;
    };

    const failure = () => {
      this.submitted = false;
    };

    const _data = data.getRawValue();

    if (this.orgStudentId) {
      this.service.update(this.orgStudentId, _data).subscribe(performAction, failure);
    } else {
      this.service.create(_data).subscribe(createPerformAction, failure);
    }
  }
}
