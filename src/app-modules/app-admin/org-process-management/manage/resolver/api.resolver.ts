import {Injectable, OnDestroy} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {TaskCeComponent} from "../components/task-ce.component";
import {TaskManagerComponent} from "../components/task-manager.component";
@Injectable()
export class PipelineAPIResolver {
    constructor(public sharedService: SharedService) {}
    showFrequencyCalenderTestPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.schedulerFactory.destroy(); };
        const failure = (err)=> { this.schedulerFactory.destroy(); };
        this.schedulerFactory.showFrequencyCalenderTestPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showTaskCalendarPopup(data, popupHeaderOption){
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption || { text: `Process`, desc: 'Process' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TaskManagerComponent, popupOptions, data).then(success, failure);
    }

    showTaskReminderCEPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.coreReminderFactory.showTaskReminderCEPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showOrgTaskReminderPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.coreReminderFactory.showTaskReminderPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    /*showOrgStagesPopup(inputData, popupHeaderOption) {
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (resp: any) => { this.pluginFactory.destroy();  };
        this.pluginFactory.showOrgStagesPopup(inputData, popupHeaderOption).then(success, failure);
    }*/

    // Process workflow
    /*showOrgTaskCEPopup(inputData, popupHeaderOption){
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (resp: any) => { this.pluginFactory.destroy();  };
        this.pluginFactory.showOrgTaskCEPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showOrgProessCEPopup(inputData, popupHeaderOption){
        const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (resp: any) => { this.pluginFactory.destroy();  };
        this.pluginFactory.showOrgProessCEPopup(inputData, popupHeaderOption).then(success, failure);
    }*/

    showTaskStatusChangePopup(inputData, popupHeaderOption){
        // const success = (resp: any) => { this.pluginFactory.destroy(); };
        // const failure = (resp: any) => { this.pluginFactory.destroy();  };
        // this.pluginFactory.showTaskStatusChangePopup(inputData, popupHeaderOption).then(success, failure);
    }
    ceOrgTaskPopup=(data: any, popupHeaderOption: any, cb)=> {
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption || { text: `Process`, desc: 'Process' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.sharedService.destroy(); cb(); };
        const failure = (e) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TaskCeComponent, popupOptions, data).then(success, failure);
    }
}
