import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
@Component({ standalone: false, selector: 'daily-info-scheduler', templateUrl: './templates/daily-scheduler.html' })
export class DailySchedulerInfoComponent {
  minutes: Array<any> = ['00', '05', '10','15','20','25','30','35','40','45','50','55'];
  hours: Array<any> = [0, 1, 2, 3, 4,5, 6, 7, 8, 9, 10, 11, 12];
  @Input() customForm: FormGroup;
  constructor(){}
  // convenience getter for easy access to form fields
  get formDaily() { return <FormGroup>this.customForm.get('daily'); }
  get f() { return this.formDaily.controls; }
  //Update Daily Form
  updateDailyFormHour(item){ this.formDaily.get('hourInterval').setValue(item); }
  updateDailyFormMinute(item){ this.formDaily.get('minuteInterval').setValue(item); }
  get dailyHourInterval(){ return this.formDaily.get('hourInterval').value; }
  get dailyMinuteInterval(){ return this.formDaily.get('minuteInterval').value; }
}
