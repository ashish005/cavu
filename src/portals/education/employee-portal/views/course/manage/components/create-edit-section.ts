import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  standalone: false,
  selector:'create-edit-section',
  templateUrl: './templates/create-edit-section.html'
})
export class CreateEditSection{
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  @Input() customForm: FormGroup;
  public get sections(): FormArray<FormGroup> { return this.customForm?.get('sections') as FormArray<FormGroup>; };

  constructor(public fb: FormBuilder) {}

  showSubjects(item: FormGroup){
    this.cb.emit(item);
  }
}
