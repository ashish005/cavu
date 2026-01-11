import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";

@Component({
    standalone: false,
    selector: 'invoice-schedule',
    templateUrl: './templates/schedule.html',
})
export class InvoiceScheduleComponent implements OnInit {
    @ViewChild('schedulerEl', { static: true }) public schedulerEl;
    @ViewChild('p', { static: true }) public p;
    @Output() cb: EventEmitter<any> = new EventEmitter<any>();

    submitted: boolean;
    addManually: boolean = true;
    isManual: boolean = true;
    isFeeTask: boolean = false;
    hideActionFooter: boolean = true;
    hideActionHeader: boolean = true;
    constructor() {}

    ngOnInit(){}

    onOkAction(data: any){
        this.p.toggle();
        this.cb.emit(data);
    }

    onCancelAction(data){
        //this.onCancel.emit(data);
    }
}