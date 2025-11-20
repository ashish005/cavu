import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {SchedulerInfoComponent} from "./schedular-info.component";
import {ACTION_ENUM} from "../../popup-module/app-popup.enum";
import {SchedulerService} from "./services/scheduler.service";

@Component({
    standalone: false,
    selector: 'multi-scheduler-info',
    templateUrl: './templates/multi-scheduler-info.html',
    styles: [`:host{ display: contents; }`],
    providers: [SchedulerService]
})
export class MultiSchedulerInfoComponent {
    @Input() list: Array<any> = [];
    @Input() id: any;
    @Input() orgTaskId: number;
    @Input() isManual: boolean;
    @Input() isFeeTask: boolean;
    @Input() addManually: boolean;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    actionType: string;
    taskSchedule: any;
    @ViewChild(SchedulerInfoComponent, { static: true }) schedulerEl: SchedulerInfoComponent;

    activeTaskSchedule(row){
        this.taskSchedule = row;
        this.id = row.id;
        this.schedulerEl.id = row.id;
        this.actionType = ACTION_ENUM.UPDATE;
        this.schedulerEl.refreshScheduler(row.id);
    }

    createNew(){
        this.taskSchedule = null;
        this.actionType = ACTION_ENUM.ADD;
        this.id = null;
        this.schedulerEl.resetFormData({
            id: null, //Schedular ID
            orgTaskId: this.orgTaskId, //Org Task Id
        });
    }

    onOkAction(data){
        this.onOk.emit(data);
    }

    onCancelAction(data){
        this.onCancel.emit(data);
    }
}