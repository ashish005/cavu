import {Component, Input, OnInit} from "@angular/core";
import {DynamicComponent} from "@app-global";
@Component({
    standalone: false,
    template: `<div class="phase-column">
        <ng-container *ngFor="let phase of context.phases; let i = index">
            <div class="phase-micro-item" >
                <span class="dot"></span>
                <span class="label" [style.color]="phase.color">
                {{ phase.name }}
            </span>
            </div>
        </ng-container>
    </div>
<!--        <a class="btn btn-xs b-theme text-xs border px-1 mx-1" (click)="showPhaseWorkflowPopup()">Phase</a>-->
<!--        <a class="btn btn-xs b-theme text-xs border px-1 mx-1" *ngIf="!context.parentId" (click)="showOrgTaskWorkflowPopup()">Task</a>-->
    `,
    styles: [
        `/* COLUMN CONTAINER — fits 50–100 items vertically */
        .phase-column {
          display: flex;
          flex-direction: column;
          gap: 1px; /* micro spacing */
          max-width: 260px;
          padding: 4px 0;
        }

        /* PHASE ITEM — ultra compact */
        .phase-micro-item {
          display: flex;
          align-items: center;
          border: 1px solid #d0d0d0;
          padding: 2px 6px;
          background: #fafafa;
          border-radius: 3px;
          font-size: 11px;
          line-height: 1;
          height: 18px; /* micro height */
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* Dot indicator */
        .phase-micro-item .dot {
          width: 5px;
          height: 5px;
          background: #999;
          border-radius: 50%;
          margin-right: 6px;
          flex-shrink: 0;
        }

        /* Verification-required = darker text (still monochrome) */
        .phase-micro-item .label.bold {
          font-weight: 600;
          color: #222;
        }

        /* Hover effect – monochrome subtle only */
        .phase-micro-item:hover {
          background: #f0f0f0;
          border-color: #b5b5b5;
        }`
    ]
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
