import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  standalone: false,
  selector:'create-edit-subject',
  templateUrl: './templates/create-edit-subject.html'
})
export class CreateEditSubject {
  @Input() customForm: FormGroup;
  public get subjects(): FormArray<FormGroup> { return this.customForm?.get('subjects') as FormArray<FormGroup>; };
  @Input() submitted: boolean;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder){}

  // convenience getter for easy access to form fields
  get f() { return this.subjects.controls; }

  initItemRows(data) {
    return this.fb.group({
      id: [ (data)?data.id: null],
      name: [ (data)?data.name:'', Validators.required],
      code: [(data)?data.code:'', Validators.required]
    });
  }

  addItem() {
    this.subjects.push(this.initItemRows({}));
  }

  removeItem(index: number) {
    this.subjects.removeAt(index);
  }

  updateForm(data){
    if(this.subjects.valid){
      this.cb.emit(this.subjects.value);
    }
  }
}
