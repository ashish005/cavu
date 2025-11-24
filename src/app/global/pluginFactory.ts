import {Injectable, Injector} from "@angular/core";
import {SharedService} from "./shared.service";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE} from "./popup-module/app-popup.enum";
import {OrgWorkflowAPIResolver} from "./services";

import {SchedulerInfoComponent} from "./modules/task-scheduler/schedular-info.component";
import {MultiSchedulerInfoComponent} from "./modules/task-scheduler/multi-scheduler-info.component";
import {TestSchedulerCalenderView} from "./modules/task-scheduler/test-scheduler-calender.view";
import {TaskActivityComponent} from "./modules/task-scheduler/task-activity.component";
@Injectable()
export class CoreProcessFactory {
    sharedService: SharedService;
    constructor(public injector: Injector, private workflowResolver: OrgWorkflowAPIResolver) {
        this.sharedService = injector.get(SharedService);
    }
    showSchedulerPopup(data: any, popupHeaderOptions: any, cb){
        const popupOptions = { header: popupHeaderOptions, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        data = data || {
            id: null, //Schedular ID
            orgTaskId: null, //Org Task Id
            isManual: null,
            isFeeTask: null,
            actionType: null, //ACTION_ENUM.ADD | ACTION_ENUM.UPDATE
        };
        const success = (resp: any) => { this.destroy(); cb(resp); };
        const failure = (e) => { this.destroy(); };
        //this.sharedService.showCustomPopup(SchedulerInfoComponent, popupOptions, data).then(success, failure);
        this.wrapperResolver().then(()=> this.showPopup(SchedulerInfoComponent, popupOptions, data).then(success, failure));
    }

    private wrapperResolver = ()=> this.workflowResolver.lookupResolver({});

    showMultiSchedulerPopup(data: any, popupHeaderOption: any, cb){
        const popupOptions = { header: popupHeaderOption || { text: `Task Scheduler`, desc: `Schedule a tasks` }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        data = data || { actionType: ACTION_ENUM.SHOW };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        //this.sharedService.showCustomPopup(MultiSchedulerInfoComponent, popupOptions, data).then(success, failure);
        this.wrapperResolver().then(()=> this.showPopup(MultiSchedulerInfoComponent, popupOptions, data).then(success, failure));
    }
    showFrequencyCalenderTestPopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); };
        const failure = (e) => { this.destroy(); };
        return this.sharedService.showCustomPopup(TestSchedulerCalenderView, popupOptions, data).then(success, failure);
    }

    showTaskActivityPopup(data, popupHeaderOption){
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption || { text: `Process`, desc: 'Process' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TaskActivityComponent, popupOptions, data).then(success, failure);
    }
    private showPopup = (component: any, popupOptions: any, data: any) => this.sharedService.showCustomPopup(component, popupOptions, data);
    private destroy = () => this.sharedService.destroy();
}