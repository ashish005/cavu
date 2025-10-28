import {Injectable, OnDestroy} from "@angular/core";
import {SharedService} from "@app-global";

@Injectable()
export class PipelineAPIResolver {
    constructor(public sharedService: SharedService) {}

    showSchedulerPopup(inputData, popupHeaderOption, cb){
        /*const success = (resp: any) => { this.schedulerFactory.destroy(); cb(); };
        const failure = (err)=> { this.schedulerFactory.destroy(); };
        this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showFrequencyCalenderTestPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.schedulerFactory.destroy(); };
        const failure = (err)=> { this.schedulerFactory.destroy(); };
        this.schedulerFactory.showFrequencyCalenderTestPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showOrgCalendarPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showOrgCalendarPopup(inputData, popupHeaderOption).then(success, failure);*/
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

    showEventTaskActivityPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showEventTaskActivityPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showEventTaskSchedulerPopup(inputData, popupHeaderOption){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (resp: any) => { this.pluginFactory.destroy();  };
        this.pluginFactory.showEventTaskSchedulerPopup(inputData, popupHeaderOption).then(success, failure);*/
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
}
