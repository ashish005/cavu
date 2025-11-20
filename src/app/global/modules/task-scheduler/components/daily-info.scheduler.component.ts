import {Component, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
@Component({ standalone: false, selector: 'daily-info-scheduler', templateUrl: './templates/daily-scheduler.html' })
export class DailySchedulerInfoComponent {
  minutes: Array<any> = ['00', '05', '10','15','20','25','30','35','40','45','50','55'];
  hours: Array<any> = [0, 1, 2, 3, 4,5, 6, 7, 8, 9, 10, 11, 12];
  AMPMOptions = { 'AM':'AM', 'PM': 'PM' };
  @Input() customForm: FormGroup;
  constructor(){}

  // convenience getter for easy access to form fields
  get formDaily() { return <FormGroup>this.customForm.get('daily'); }

  get f() { return this.formDaily.controls; }

  //Update Daily Form
  updateDailyFormHour(item){ this.formDaily.get('hourInterval').setValue(item); }
  updateDailyFormMinute(item){ this.formDaily.get('minuteInterval').setValue(item); }
  updateDailyAMPM(item){ this.formDaily.get('ampm').setValue(item); }

  get dailyHourInterval(){ return this.formDaily.get('hourInterval').value; }
  get dailyMinuteInterval(){ return this.formDaily.get('minuteInterval').value; }
  get dailyAMPM(){
    const ampm = this.formDaily.get('ampm').value;
    return (ampm)? this.AMPMOptions.PM: this.AMPMOptions.AM;
  }
}
