import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, tap} from "rxjs";
import {CommonModule} from "@angular/common";
@Component({
  selector: 'date-time-picker',
  templateUrl: './templates/date-time-picker.html',
  styles:[`:host input[type='date'] { height: 26px;}
  :host .md-form-group { padding: 14px 0px 0px 0; }
  `],
  standalone: true, imports: [CommonModule, ReactiveFormsModule]
})
export class DateTimePickerComponent implements OnInit {
  @Input() customForm: FormGroup;
  constructor(public fb: FormBuilder) {}

  get formStartDate(){ return this.customForm.get('startDate'); }
  get formEndDate(){ return this.customForm.get('endDate'); }

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  ngOnInit(){
      // this.customForm.valueChanges.pipe(
      //     distinctUntilChanged((x, y) =>{ return x.startDate === y.startDate && x.endDate === y.endDate }),
      //     debounceTime(100),
      //     tap(data => { this.cb.emit(data); })
      // ).subscribe();
  }
}
