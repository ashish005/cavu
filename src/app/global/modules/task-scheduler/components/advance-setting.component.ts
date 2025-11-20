import {FormBuilder, FormGroup} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
@Component({ standalone: false, selector: 'advance-setting', templateUrl: './templates/advance-setting.html' })
export class SchedulerAdvanceSettingComponent implements OnInit{
  @Input() customForm: FormGroup;
  delayTask: Array<any> = [
    { name: '30 sec', id:.5 },
    { name: '1 minute', id:1},
    { name: '30 minute', id:30 },
    { name: '1 Hour', id:60 },
    { name: '8 Hour', id:480},
    { name: '1 Day', id:24*60 }
  ];

  repeatTask: Array<any> = [
    { name: '5 minutes', id:1 },
    { name: '10 minutes', id:2},
    { name: '15 minutes', id:3 },
    { name: '30 minutes', id:4 },
    { name: '1 Hour', id:5}
  ];
  repeatDuration: Array<any> = [
    { name: 'Indefinitely', id:1 },
    { name: '15 minutes', id:2},
    { name: '30 minutes', id:3 },
    { name: '1 Hour', id:4 },
    { name: '12 Hours', id:5},
    { name: '1 Day', id:6}
  ];

  longRunningTaskDuration: Array<any> = [
    { name: '30 minutes', id:1 },
    { name: '1 Hour', id:2 },
    { name: '2 Hours', id:3 },
    { name: '4 Hours', id:4 },
    { name: '8 Hours', id:5 },
    { name: '12 Hours', id:6 },
    { name: '1 Day', id:7 },
    { name: '3 Day', id:8 }
  ];
  constructor(public fb: FormBuilder) {}

  ngOnInit(){}

  // convenience getter for easy access to form fields
  get f() { return this.customForm.controls; }

  get formDelayTask() { return <FormGroup>this.customForm.get('taskDelayDuration'); }
  updateDelayTask(val){ this.formDelayTask.setValue(val); }

  get formStopTask() { return <FormGroup>this.customForm.get('taskMaxDuration');}
  updateStopTask(val){ this.formStopTask.setValue(val); }


  get formRepeatTask() { return <FormGroup>this.customForm.get('repeatTaskStart'); }
  updateRepeatTask(val){ this.formRepeatTask.setValue(val); }

  get formRepeatDuration() { return <FormGroup>this.customForm.get('repeatTaskDuration'); }
  updateRepeatDuration(val){ this.formRepeatDuration.setValue(val); }

  get isDelayTaskActive(){ return !this.customForm.get('isTaskDelay').value; }
  get isRepeatTaskActive(){ return !this.customForm.get('isRepeatTask').value; }

  get isStopAtEndRepetitionActive(){ return !this.customForm.get('isStopTaskAtEndRepetition').value; }
  get isStopIfLongerThanActive(){ return !this.customForm.get('isStopTaskIfLongerThan').value; }

  //get isExpireActive(){ return !this.customForm.get('isExpire').value; }
}
