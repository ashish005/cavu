import {
    Component,
    OnInit,
    AfterViewInit, Input, OnDestroy, ViewChild, TemplateRef
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    templateUrl: './templates/org-task.html',
    styles: [`:host { display: contents; }`]
})
export class OrgTaskView {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @Input() orgTaskId: any;
    tabs: any = {
        'ce': 'ce',
        'reminder': 'reminder',
        'calendar': 'calendar',
        'schedules': 'schedules',
        'activity': 'activity',
        'team': 'team'
    };
    activeTab: string = this.tabs.ce;
    openTab(tab: string){ this.activeTab = tab; }
    constructor(public fb: FormBuilder, public activatedRoute: ActivatedRoute){ }

    onOkAction(data){
        //this.onOk.emit(data);
    }

    onCancelAction(data){
        //this.onCancel.emit(data);
    }
}
