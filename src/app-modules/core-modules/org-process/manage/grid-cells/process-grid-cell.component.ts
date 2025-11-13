import {Component, Input, OnInit} from "@angular/core";
import {CoreProcessFactory, DynamicComponent} from "@app-global";
import {OrgProcess} from "../domains/org-process.serializer";
@Component({
    standalone: false,
    template: `<a class="btn btn-xs b-theme text-xs border px-1 mx-1" *ngIf="!context.parentId" (click)="showOrgWorkflowPopup(context)">Workflow</a>`
})
export class ProcessWorkFlowCellComponent extends DynamicComponent {
    constructor(private pluginFactory: CoreProcessFactory) {
        super();
    }
    showOrgWorkflowPopup(row: OrgProcess) {
        const { id, name, description } = row;
        const data= { id: id, data: row };
        this.pluginFactory.showWorkflowPopup(data, {text: `${name}`, desc: `${description || ''}`}, ()=>{});
    }
}
