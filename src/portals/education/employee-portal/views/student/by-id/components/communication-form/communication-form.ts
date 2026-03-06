import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {StudentService} from "../../services/student.service";
import {StudentAPIResolver} from "../../services/api.resolver";
import {ACTION_ENUM} from "@app-global";

@Component({
  standalone: false,
  templateUrl: './communication-form.html'
})
export class CommunicationForm implements OnInit{
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  customForm: FormGroup;
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Input() id: number;
  @Input() set data (val ){
    this.customForm.patchValue(val);
  };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  submitted: boolean;
  constructor(public fb: FormBuilder, public orgUserService: StudentService, public apiResolver: StudentAPIResolver) {}

  ngOnInit(){
    this.customForm = this.fb.group({
      id: [null],
      name: [null],
      userConatctTypeId: [null, Validators.required],
      showName: [{value: null, disabled: true}]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  submitCommunicationInfo(data){
    if (data.invalid) {
      this.submitted = false;
      return;
    }

    this.submitted = true;
    const performAction = (resp)=> {
      this.submitted = false;
    };

    const failure = ()=> {
      this.submitted = false;
    };
    //this.orgUserService.updateCommunication(this.apiResolver.studentId, data.value).subscribe(performAction, failure);
  }
}
