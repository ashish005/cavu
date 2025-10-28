import {Component, Input, OnInit} from "@angular/core";
import { DynamicComponent} from "@app-global";
import {OrgProcess} from "../domains/org-process.serializer";

@Component({
    standalone: false,
    template: `
<a class="btn btn-xs b-theme text-xs border px-1 mx-1" *ngIf="context.totalSubProcesses" (click)="showOrgWorkflowPopup(context)">Workflow</a>
<a class="btn btn-xs b-theme text-xs border px-1 mx-1" (click)="showProcessPhases(context)">Phases</a>
`
})
export class ProcessWorkFlowCellComponent extends DynamicComponent {
    constructor() {
        super();
    }

    showOrgWorkflowPopup(row: OrgProcess) {
        // const { id, name, description } = row;
        // const data = {
        //     id: id,
        //     data: row
        // };
        // this.pluginFactory.showOrgWorkflowPopup(data, {text: `${name}`, desc: `${description}`}, ()=>{});
    }

    showProcessPhases(row: OrgProcess) {
        // const { id, parentId, name, description } = row;
        // const data = {
        //     id: id,
        //     parentId: parentId,
        //     data: row
        // };
        // this.pluginFactory.showProessCEPopup(data, {text: `${name}`, desc: `${description}`}, ()=>{});
    }
}
