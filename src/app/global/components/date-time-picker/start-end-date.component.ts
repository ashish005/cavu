import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'start-end-date',
  templateUrl: './templates/start-end-date.html',
  standalone: true, imports: [CommonModule, ReactiveFormsModule]
})
export class StartEndDateComponent {
  customForm: FormGroup;
  @Input() items:Array<string> = [];
  @Input() title: string;
  @Input() selected: string;
  @Input() disabled?: boolean = false;

  @Input() bindLabel : string = "name";
  @Input() bindValue : string = "id";

  @Output() cb: EventEmitter<string> = new EventEmitter<string>();

  submitted: boolean = false;
  constructor(){}

  onChange(){
    this.cb.emit(this.selected);
  }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }
}
