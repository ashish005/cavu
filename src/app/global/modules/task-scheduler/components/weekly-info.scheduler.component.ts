import {Component, Input, OnInit} from "@angular/core";
import {FormArray, FormGroup} from "@angular/forms";
@Component({ standalone: false, selector: 'weekly-info-scheduler', templateUrl: './templates/weekly-scheduler.html' })
export class WeeklySchedulerInfoComponent {
  weeksOf: Array<any> = [
      { name: 'First', id:1, checked: true},
      { name: 'Second', id:2, checked: false},
      { name: 'Third', id:3, checked: false},
      { name: 'Fourth', id:4, checked: false},
      { name: 'Last', id:-1, checked: false}
  ];
  @Input() customForm: FormGroup;
  constructor(){}

  // convenience getter for easy access to form fields
  get formWeekly() { return <FormGroup>this.customForm.get('weekly'); }
  get f() { return this.formWeekly.controls; }

  get formIsAllWeekDay(): FormGroup{ return <FormGroup>this.formWeekly.get('isAllWeekDay'); }
  get weekDayNoFromArray(): FormArray{ return <FormArray>this.formWeekly.get('weekDayNo'); }
  get formWeekInterval(): FormArray{ return <FormArray>this.formWeekly.get('weekInterval'); }

  updateWeekInterval(val){ this.formWeekInterval.setValue(val); }

  isAllApply(controlArrayForm, isChecked){
    const updateVal = itemForm => {
      if(isChecked){
        itemForm.get('isChecked').setValue(true);
      } else {
        itemForm.get('isChecked').setValue(false);
      }
    };
    controlArrayForm.controls.map(updateVal);
  }
}
