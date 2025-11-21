import {
    Component,
    EventEmitter, Injector,
    Input,
    OnDestroy,
    OnInit,
    Output, TemplateRef, ViewChild
} from "@angular/core";
import { SchedularForm } from "./factories/schedular-form.factory";
import {FormBuilder} from "@angular/forms";
import {SchedulerService} from "./services/scheduler.service";
import {ACTION_ENUM} from "../../popup-module/app-popup.enum";
import {Subscription, pairwise, startWith} from "rxjs";
import {SchedularDomain, SchedularParser} from "./domains/schedular.domain";
import {FREQUENCY_TYPE} from "../../enums";
import {EventFrequencyTypeLookup, OrgWorkflowAPIResolver} from "../../services";

@Component({
  standalone: false,
  selector: 'org-scheduler',
  templateUrl: './templates/org-scheduler.html',
  styles:[`:host { display: contents; }`],
  providers: [SchedulerService]
})
export class OrgSchedularComponent extends SchedularForm implements OnInit, OnDestroy {
  @ViewChild('schedularActionTemplate', { static: true }) public schedularActionTemplate: TemplateRef<any>;
  @ViewChild('schedularShowCalenderTemplate', { static: true }) public schedularShowCalenderTemplate: TemplateRef<any>;

  @Input() id: string; //scheduler id
  @Input() orgTaskId: any;

  @Input() isManual: boolean = false;
  @Input() isFeeTask: boolean = false;
  @Input() addManually: boolean = false;
  @Output() onTestClick: EventEmitter<SchedularDomain> = new EventEmitter<SchedularDomain>();
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }
  submitted: boolean = false;

  frequencyTypes: Array<EventFrequencyTypeLookup>;
  activeFrequency: EventFrequencyTypeLookup;
  taskSchedule: SchedularDomain;
  subscriber: Subscription;
  frequencyTypeEnum: any = FREQUENCY_TYPE;
  constructor(public override fb: FormBuilder, public override injector: Injector,
              public lookupResolver: OrgWorkflowAPIResolver,
              private schedulerService: SchedulerService) {
      super(fb, injector);
  }

  ngOnDestroy(){ this.subscriber?.unsubscribe(); }

  ngOnInit(){
      let lookup = this.lookupResolver.masterType;
      this.frequencyTypes = (this.isFeeTask) ? lookup.getFeeFrequencies(): lookup.frequencyTypes;

      this.refreshScheduler(this.id);
      const itemFormValueChange = ([prev, next]: [number, number]) =>
      {
          if(prev != next)
          {
              this.activeFrequency = this.frequencyTypes.find(r => r.id == next);
              if(!this.activeFrequency) {
                  this.activeFrequency = this.frequencyTypes.find(r => r.isDefault);
              }
              this.updateFrequencyFormByType(this.activeFrequency.masterType)
          }
      };
      this.frequencyTypeId.valueChanges.pipe(startWith(null as number), pairwise()).subscribe(itemFormValueChange);
  }

  public refreshScheduler(schedulerId){
    if(!schedulerId){ return; }
    this.id = schedulerId;

    const success = (resp: SchedularDomain)=>{
      this.taskSchedule = resp;
      this.isManual = this.taskSchedule.isManual;
      this.updateSchedularForm(SchedularParser.parseDetails(resp));
    };

    const error = (err)=>{};
    this.subscriber = this.schedulerService.getOrgSchedulerById(schedulerId).subscribe(success, error);
  }

    getSchedulerFormValues(){
        const data = this.customForm.getRawValue();
        const schedular = new SchedularDomain(data);
        schedular.updateDaily(data.daily);
        schedular.updateWeekly(data.weekly);
        schedular.updateMonthly(data.monthly);
        schedular.updateOnEvent(data.event);
        return schedular;
    }

  resetFormData(data){
    const sampleData = SchedularParser.parseDetails(data);
    this.updateSchedularForm(sampleData);
  }

    getSchedulerPostValues(){
        const data: SchedularDomain = this.getSchedulerFormValues();
        data.onlyPopulateFrequencyValues(this.activeFrequency.masterType);
        data.id = this.id;
        return data;
    }

  applyFrequency(){
    const success = r => { this.submitted = false; this.onOk.emit(r.data); };
    const failure = r => { this.submitted = false; };
    const data: SchedularDomain = this.getSchedulerPostValues();
    if(this.addManually){
       this.onOk.emit(data);
       return;
    }

    this.submitted = true;
    if(this.id){
        this.schedulerService.updateScheduler(this.id, data).toPromise().then(success, failure);
    } else {
        data.orgTaskId = this.orgTaskId;
        this.schedulerService.addScheduler(data).toPromise().then(success, failure);
    }
  }

  cancelFrequency=() => this.refreshScheduler(this.id);
  testScheduler(){this.onTestClick.emit(this.getSchedulerPostValues())}
}

