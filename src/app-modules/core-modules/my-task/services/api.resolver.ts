import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class MyTaskAPIResolver {
    refreshTask$: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor() {}

    showEventTaskPopup(inputData, popupHeaderOption)
    {
        const success = (resp: any) => {
            this.refreshTask$.emit(true);
        };
        const failure = (err)=> {  };
        //this.pluginFactory.showEventTaskPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showSchedulerPopup(inputData, popupHeaderOption){
        // const success = (resp: any) => {
        //     this.refreshTask$.emit(true);
        //     this.schedulerFactory.destroy();
        // };
        // const failure = (err)=> { this.schedulerFactory.destroy(); };
        // this.schedulerFactory.showSchedulerPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showOrgCalendarPopup(inputData, popupHeaderOption){
        const success = (resp: any) => {
            this.refreshTask$.emit(true);
        };
        const failure = (err)=> {  };
        /*this.pluginFactory.showOrgCalendarPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showOrgTaskReminderCEPopup(inputData, popupHeaderOption){
        // const success = (resp: any) => {
        //     this.refreshTask$.emit(true);
        //     this.pluginFactory.destroy();
        // };
        // const failure = (err)=> { this.pluginFactory.destroy(); };
        // this.pluginFactory.showOrgTaskReminderCEPopup(inputData, popupHeaderOption).then(success, failure);
    }

    showEventTaskActivityPopup(inputData, popupHeaderOption){
        const success = (resp: any) => {
            this.refreshTask$.emit(true);
        };
        const failure = (err)=> { };
        /*this.pluginFactory.showEventTaskActivityPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showTaskStatusChangePopup(inputData, popupHeaderOption){
        const success = (resp: any) => {
            this.refreshTask$.emit(true);
        };
        const failure = (err)=> { };
        /*this.pluginFactory.showTaskStatusChangePopup(inputData, popupHeaderOption).then(success, failure);*/
    }
}
