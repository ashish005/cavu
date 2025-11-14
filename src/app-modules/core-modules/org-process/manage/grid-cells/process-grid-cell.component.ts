import {Component, Input, OnInit} from "@angular/core";
import {DynamicComponent} from "@app-global";
@Component({
    standalone: false,
    template: `
<!--        <a class="btn btn-xs b-theme text-xs border px-1 mx-1" (click)="showPhaseWorkflowPopup()">Phase</a>-->
<!--        <a class="btn btn-xs b-theme text-xs border px-1 mx-1" *ngIf="!context.parentId" (click)="showOrgTaskWorkflowPopup()">Task</a>-->
    `
})
export class ProcessWorkFlowCellComponent extends DynamicComponent {
    constructor() { super(); }
    /*showOrgTaskWorkflowPopup() {
        const { id, name, description } = this.context;
        const data= { id: id, data: this.context };
        this.pluginFactory.showTaskWorkflowPopup(data, {text: `${name}`, desc: `${description || ''}`}, ()=>{});
    }
    showPhaseWorkflowPopup() {
        const { id, name, description } = this.context;
        const data= { id: id, data: this.context };
        this.pluginFactory.showPhaseWorkflowPopup(data, {text: `${name}`, desc: `${description || ''}`}, ()=>{});
    }*/
}
