import {Injectable, Injector} from "@angular/core";
import {SharedService} from "./shared.service";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE} from "./popup-module/app-popup.enum";
import {OrgWorkflowAPIResolver} from "./services";

import {SchedulerInfoComponent} from "./modules/task-scheduler/schedular-info.component";
import {MultiSchedulerInfoComponent} from "./modules/task-scheduler/multi-scheduler-info.component";
import {TestFrequencyCalenderView} from "./modules/task-scheduler/test-frequency-calender.view";
@Injectable()
export class CoreProcessFactory {
    sharedService: SharedService;
    constructor(public injector: Injector, private workflowResolver: OrgWorkflowAPIResolver) {
        this.sharedService = injector.get(SharedService);
    }
    showSchedulerPopup(data: any, popupHeaderOptions: any){
        const popupOptions = { header: popupHeaderOptions, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        data = data || {
            id: null, //Schedular ID
            orgTaskId: null, //Org Task Id
            isManual: null,
            isFeeTask: null,
            actionType: null, //ACTION_ENUM.ADD | ACTION_ENUM.UPDATE
        };
        return this.sharedService.showCustomPopup(SchedulerInfoComponent, popupOptions, data);
    }
    showMultiSchedulerPopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption || { text: `Task Scheduler`, desc: `Schedule a tasks` }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        data = data || { actionType: ACTION_ENUM.SHOW };
        return this.sharedService.showCustomPopup(MultiSchedulerInfoComponent, popupOptions, data);
    }
    showFrequencyCalenderTestPopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        return this.sharedService.showCustomPopup(TestFrequencyCalenderView, popupOptions, data);
    }
    /*
    showPhaseWorkflowPopup=(data: any, popupHeaderOption: any, cb)=>{
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        this.showPopup(WorkflowWithPhaseView, popupOptions, data).then(success, failure);
    }
    showTaskWorkflowPopup=(data: any, popupHeaderOption: any, cb)=>{
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        this.showPopup(WorkflowWithTaskView, popupOptions, data).then(success, failure);
    }*/
    private showPopup = (component: any, popupOptions: any, data: any) => this.sharedService.showCustomPopup(component, popupOptions, data);
    private destroy = () => this.sharedService.destroy();
}