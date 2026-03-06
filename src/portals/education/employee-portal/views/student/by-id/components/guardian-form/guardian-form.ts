import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output, TemplateRef, ViewChild
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentAPIResolver, StudentService} from "../../services";
import {ACTION_ENUM} from "@app-global";

@Component({
  standalone: false,
  selector:'guardian-form',
  templateUrl: './guardian-form.html'
})
export class GuardianForm {
  @Input() id: number;
  @Input() userId: string;
  get actionType (){ return (this.id) ? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; };
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

  submitted: boolean;
  customForm: FormGroup;
  constructor(private fb: FormBuilder, public service: StudentService, public apiResolver: StudentAPIResolver) {
    this.customForm = this.fb.group({
      id: [null],
      isPrimary: [null],
      title: [null],
      fName: [null],
      lName: [null],
      email: [null],
      phone: [null],
      qualificationId: [null],
      professionId: [null],
      departmentId: [null],
      incomeId: [null],
      relationTypeId: [null, Validators.required],
      showName: [{value: null, disabled: true}]
    });
  }

  @Input() set data (val){
    this.customForm.patchValue(val);
  };

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formId(): FormGroup {
    return <FormGroup>this.customForm.get('id');
  }

  get formTitle() {
    return <FormArray>this.customForm.get('title');
  }

  get formRelation() {
    return <FormArray>this.customForm.get('relation');
  }
  get formQualificationId() {
    return <FormArray>this.customForm.get('qualificationId');
  }
  get formProfessionId() {
    return <FormArray>this.customForm.get('professionId');
  }

  get formDepartmentId() {
    return <FormArray>this.customForm.get('departmentId');
  }

  get formIncomeId() {
    return <FormArray>this.customForm.get('incomeId');
  }

  updateTitle(val){
    this.formTitle.setValue(val);
  }

  updateRelation(val){
    this.formRelation.setValue(val);
  }

  updateQualificationId(val){
    this.formQualificationId.setValue(val);
  }

  updateProfessionId(val){
    this.formProfessionId.setValue(val);
  }

  updateDepartmentId(val){
    this.formDepartmentId.setValue(val);
  }

  updateIncomeId(val){
    this.formIncomeId.setValue(val);
  }

  updateForm(data){
    if (data.invalid) {
      this.submitted = false;
      return;
    }

    this.submitted = true;
    const performAction = (resp)=> {
      this.submitted = false;
      this.onOk.emit(this.customForm.value);
    };

    const failure = ()=> {
      this.submitted = false;
    };

    const formData = data.getRawValue();
    this.service.updateGuardian(this.userId, formData).subscribe(performAction, failure);
  }
}
