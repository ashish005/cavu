import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {SchedulerService} from "../services/scheduler.service";
@Component({ standalone: false, selector: 'event-info-scheduler', templateUrl: './templates/event-scheduler.html' })
export class EventInfoSchedularComponent implements OnInit{
  @Input() customForm: FormGroup;
  constructor(private service: SchedulerService){ }
  // convenience getter for easy access to form fields
  get formEvent() { return <FormGroup>this.customForm.get('event'); }
  get f() { return this.formEvent.controls; }
  get formTarget() { return <FormGroup>this.formEvent.get('target'); }
  get formTargetLink() { return <FormGroup>this.formEvent.get('targetLink'); }
  updateEvent(val){ this.formTarget.setValue(val); }
  ngOnInit(){}
}
