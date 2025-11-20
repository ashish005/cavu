import {Component, Input, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup} from "@angular/forms";

@Component({ standalone: false, selector: 'monthly-info-scheduler', templateUrl: './templates/monthly-scheduler.html' })
export class MonthlySchedulerInfoComponent {
  @Input() customForm: FormGroup;
  id: string = "monthly-info-scheduler";
  constructor(){}

  // convenience getter for easy access to form fields
  get formMonthly() { return <FormGroup>this.customForm.get('monthly'); }
  get f() { return this.formMonthly.controls; }

  get formIsAllMonth(): FormGroup { return <FormGroup>this.formMonthly.get('isAllMonth'); }
  get formOn(): FormGroup { return <FormGroup>this.formMonthly.get('on'); }
  get formMonthlyMonthNo(): FormArray{ return <FormArray>this.formMonthly.get('monthNo'); }

  get formMonthlyDays(): FormArray{ return <FormArray>this.formMonthly.get('dayNo'); }
  get formMonthlyWeeks(): FormArray{ return <FormArray>this.formMonthly.get('weekNo'); }
  get formMonthlyWeekDayNo(): FormArray{ return <FormArray>this.formMonthly.get('monthlyWeekDayNo'); }


  /*updateMonthlyDays(items){
    this.formMonthlyDays.controls.length = 0;
    (items || []).map(val => this.formMonthlyDays.push(this.sfFactory.getFormControl(val)));
  }

  updateMonthlyWeeks(items){
    this.formMonthlyWeeks.controls.length = 0;
    (items || []).map(val => this.formMonthlyWeeks.push(this.sfFactory.getFormControl(val)));
  }

  updateMonthlyWeekDayNo(items){
    this.formMonthlyWeekDayNo.controls.length = 0;
    (items || []).map(val => this.formMonthlyWeekDayNo.push(this.sfFactory.getFormControl(val)));
  }*/

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
