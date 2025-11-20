import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {SchedulerService} from "../services/scheduler.service";
import {SchedulerTask, SchedulerTaskParam} from "../domains/schedular.domain";
@Component({ standalone: false, selector: 'event-info-scheduler', templateUrl: './templates/event-scheduler.html' })
export class EventSchedulerInfoComponent implements OnInit{
  @Input() customForm: FormGroup;
  tasks: Array<SchedulerTask>;
  onTaskChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private service: SchedulerService){ }

  // convenience getter for easy access to form fields
  get formEvent() { return <FormGroup>this.customForm.get('event'); }
  get f() { return this.formEvent.controls; }
  get formAfterSucessOnTaskId() { return <FormGroup>this.formEvent.get('afterSucessOnTaskId'); }
  //get formOrgTask() { return <FormGroup>this.formEvent.get('orgTaskId'); }
  updateEventTask(val){ this.formAfterSucessOnTaskId.setValue(val); }

  ngOnInit(){
    this.synchTask();
      // const itemFormValueChange = ([prev, next]: [number, number]) =>
      // {
      //     if(prev != next)
      //     {
      //         const task = this.activeTasks.find(r => r.id == next);
      //         this.formOrgTask.setValue(<any>task?.id);
      //         // if(!next) {
      //         //     this.activeFrequency = this.frequencyTypes.find(r => r.masterType == "FIXED_TIME");
      //         // }
      //         // this.activeFrequency = this.frequencyTypes.find(r => r.id == next);
      //     }
      // };
      // this.formEventTask.valueChanges.pipe(startWith(null as number), pairwise()).subscribe(itemFormValueChange);
  }

  synchTask(){
    this.tasks = [];
    const success = (data)=>{
      this.tasks = (data || []).map(r => new SchedulerTask(r));
    };
    const failure = (data)=>{};
    const taskParam: SchedulerTaskParam = new SchedulerTaskParam();
    //taskParam.IsPeriodType = true;
    this.service.getOrgTaskEvents(taskParam).subscribe(success, failure);
  }
}
