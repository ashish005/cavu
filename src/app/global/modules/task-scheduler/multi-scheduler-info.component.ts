import {Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {SchedulerInfoComponent} from "./schedular-info.component";
import {SchedulerService} from "./services/scheduler.service";
import {CoreEndpointBase} from "../../services/index";
import {CoreQueryOptions} from "../../services/models";
import {Subscription} from "rxjs";
class SchedulerQueryOptions extends CoreQueryOptions {
    orgTaskId: any;
    orgUserId: string;
    constructor(model: any = {}){
        super(model);
    }

    override toQueryString (){
        const obj = {
            orgTaskId: this.orgTaskId,
            orgUserId: this.orgUserId
        };
        return super.getParamByObject(obj);
    }
}
@Component({
    standalone: false,
    selector: 'multi-scheduler-info',
    templateUrl: './templates/multi-scheduler-info.html',
    styles: [`:host{ display: contents; }`],
    providers: [SchedulerService]
})
export class MultiSchedulerInfoComponent extends CoreEndpointBase implements OnInit, OnDestroy {
    list: Array<any> = [];
    @Input() id: any;
    @Input() orgTaskId: number;
    @Input() isManual: boolean;
    @Input() isFeeTask: boolean;
    @Input() addManually: boolean;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    taskSchedule: any;

    subscriber: Subscription;
    coreState: SchedulerQueryOptions = new SchedulerQueryOptions();
    @ViewChild(SchedulerInfoComponent, { static: true }) schedulerEl: SchedulerInfoComponent;
    constructor(public override injector: Injector){ super(injector); }
    ngOnInit()
    {
        if(this.orgTaskId) { this.getSchedulerList(); }
    }
    getSchedulerList()
    {
        this.coreState.orgTaskId = this.orgTaskId;
        const success = (r)=> { this.list = r.entities; };
        const error = (r)=> {};
        this.subscriber = this.httpClient.get(`${this.baseSectorAPIUrl}/taskSchedule?${this.coreState.toQueryString()}`, this.requestHeaders).subscribe(success, error);
    }
    ngOnDestroy(){ this.subscriber?.unsubscribe(); }
    scheduleClick(row){
        this.taskSchedule = row;
        this.id = row.id;
        this.schedulerEl.id = row.id;
        this.schedulerEl.refreshScheduler(row.id);
    }
    createNew(){
        this.taskSchedule = null;
        this.id = null;
        this.schedulerEl.resetFormData({
            id: null, //Schedular ID
            orgTaskId: this.orgTaskId, //Org Task Id
        });
    }
    onOkAction(data){ this.onOk.emit(data); }
    onCancelAction(data){ this.onCancel.emit(data); }
}