import {
    Component,
    EventEmitter, Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { SchedularForm } from "./factories/schedular-form.factory";
import {FormBuilder} from "@angular/forms";
import {SchedulerService} from "./services/scheduler.service";
import {ACTION_ENUM} from "../../popup-module/app-popup.enum";
import {Subscription, BehaviorSubject, Subject, pairwise, startWith, debounceTime} from "rxjs";
import {SchedularDomain, SchedularParser} from "./domains/schedular.domain";
import {FREQUENCY_TYPE} from "../../enums";
import {EventFrequencyTypeLookup, OrgWorkflowAPIResolver} from "../../services/orgwise";
@Component({
  standalone: false,
  selector: 'scheduler-info',
  templateUrl: './templates/scheduler-info.html',
  styles:[`
    :host { display: contents; }
  :host ::ng-deep .ng-select.ng-select-single .ng-select-container .ng-value-container, .ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{
  margin: 5px;
  }

  :host ::ng-deep .list-item {
    padding: 0 .5rem !important;
  }
  :host ::ng-deep li.small-area {
      float: left;
      width: 30px;
      background: red;
    }
  `],
  providers: [SchedulerService]
})
export class SchedulerInfoComponent extends SchedularForm implements OnInit, OnDestroy {
  @ViewChild('calendarYear', { static: true }) public calendarYear;
  //@ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @ViewChild('schedularActionTemplate', { static: true }) public schedularActionTemplate: TemplateRef<any>;
  @ViewChild('testSchedularActionTemplate', { static: true }) public testSchedularActionTemplate: TemplateRef<any>;

  @Input() hideActionFooter: boolean = false;
  @Input() hideActionHeader: boolean = false;
  @Input() id: string; //scheduler id
  @Input() orgTaskId: any;

  @Input() isManual: boolean = false;
  @Input() isFeeTask: boolean = false;

  @Input() addManually: boolean = false;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  get actionType(){ return (this.id)? ACTION_ENUM.UPDATE: ACTION_ENUM.ADD; }
  submitted: boolean = false;

  subscriber: Subscription;

  frequencyTypes: Array<EventFrequencyTypeLookup>;
  activeFrequency: EventFrequencyTypeLookup;
  taskSchedule: SchedularDomain;
  frequencyTypeEnum: any = FREQUENCY_TYPE;
  constructor(public override fb: FormBuilder, public override injector: Injector,
              public lookupResolver: OrgWorkflowAPIResolver,
              private schedulerService: SchedulerService) {
      super(fb, injector);
      let lookup = lookupResolver.masterType;
      this.frequencyTypes = (this.isFeeTask) ? lookup.getFeeFrequencies(): lookup.frequencyTypes;
      this.activeFrequency = this.activeFrequency ?? lookup.defaultFrequency();
      this.updateFrequencyFormByType(this.activeFrequency.masterType)
      const itemFormValueChange = ([prev, next]: [number, number]) =>
      {
          if(prev != next)
          {
              this.activeFrequency = this.frequencyTypes.find(r => r.id == next);
              this.updateFrequencyFormByType(this.activeFrequency.masterType)
          }
      };
      this.frequencyTypeId.valueChanges.pipe(startWith(null as number), pairwise()).subscribe(itemFormValueChange);
  }
  ngOnDestroy(){ this.subscriber?.unsubscribe(); }
  ngOnInit(){
      this.refreshScheduler(this.id);
      this.customForm.get('hasNoExpiration')?.valueChanges.pipe(
          debounceTime(10) // Small debounce to ensure smooth updates
      ).subscribe(value => {
          const endDateControl = this.customForm.get('endDate');
          const endTimeControl = this.customForm.get('endTime');
          const endTimeZoneControl = this.customForm.get('endTimeZone');
          if (value) {
              endDateControl?.disable();
              endTimeControl?.disable();
              endTimeZoneControl?.disable();
          } else {
              endDateControl?.enable();
              endTimeControl?.enable();
              endTimeZoneControl?.enable();
          }
      });
  }
  public refreshScheduler(schedulerId){
    if(!schedulerId){
      return;
    }

    const success = (resp: SchedularDomain)=>{
      this.taskSchedule = resp;
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
    const failure = r => { this.submitted = false;  this.onCancel.emit(null); };
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

  cancelFrequency(){
    // whatever you want to do here
    this.onCancel.emit(this.getSchedulerFormValues());
  }

    testScheduler() {
      //const { masterType } =  this.activeFrequency;
      const data = this.getSchedulerPostValues();
      const { startDate, endDate, hasNoExpiration } = data;
        const success = (resp)=>{
            this.calendarYear.applySchedular(startDate, endDate, resp.entities);
        };
        const error = (e)=>{ };
        this.schedulerService.testScheduler(data).subscribe(success, error);
  }
}

