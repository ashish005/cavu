import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {ACTION_ENUM} from "@app-global";
import {FeePlanService} from "../services/fee-plan.service";
import {FeeStructure} from "../domains/fee-structure.serializer";
import {FeePlan} from "../domains/fee-plan.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/fee-plan-detail.html',
    styles: [`:host{ display: contents; }`]
})
export class FeePlanDetailView implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('schedulerEl', { static: true }) public schedulerEl;
    @Input() id: any; //fee plan id
    loading: boolean = true;
    item: FeePlan;
    subscriber: Subscription;

    tabs: any = {
        'summary': 'summary',
        'schedules': 'schedules',
        'calendar': 'calendar'
    };
    //@Input() activeTab: string = this.tabs.summary;
    activeTab: string = this.tabs.summary;
    openTab(tab: string){ this.activeTab = tab; }
    activeFeeStructure: FeeStructure;

    schedulerActionType: string;
    isFeeTask: boolean = true;
    isManual: boolean = false;
    addManually: boolean = true;
    constructor(public service: FeePlanService) {}

    ngOnInit(){
        this.refreshSummary();
    }

    ngOnDestroy(){ this.subscriber?.unsubscribe(); }

    scheduleClick(row: FeeStructure){
        const { orgTaskScheduleId, name, orgTaskId, frequencyTypeId } = row;
        this.activeFeeStructure = row;
        this.schedulerActionType = ACTION_ENUM.UPDATE;
        this.schedulerEl.id = orgTaskScheduleId;
        this.schedulerEl.resetFormData({
            id: orgTaskScheduleId,
            orgTaskId: orgTaskId,
            name: `${name}`,
            frequencyTypeId: frequencyTypeId
        });
        this.schedulerEl.refreshScheduler(orgTaskScheduleId);
    }

    refreshSummary()
    {
        this.loading = true;
        const success =(resp)=>{
            this.loading = false;
            this.item = resp.data;
        };
        const failure =(resp)=>{
            this.loading = false;
        };
        this.subscriber = this.service.read(this.id).subscribe(success, failure);
    }

    onSchedulerOkAction(schedulerData){
        const { feeTypeId } = this.activeFeeStructure;
        const schedulerSuccess =()=>{ this.refreshSummary(); }
        this.service.updateFeeTypeScheduler(feeTypeId, schedulerData).toPromise().then(schedulerSuccess, ()=>{});
    }

    onSchedulerCancelAction(data){}
}