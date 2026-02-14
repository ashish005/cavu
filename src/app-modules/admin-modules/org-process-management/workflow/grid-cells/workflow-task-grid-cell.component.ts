import {Component, Input, OnInit} from "@angular/core";
import {DynamicComponent} from "@app-global";
import {OrgWorkflowPhaseStepTask} from "../domains/phase-step-task.serializer";

@Component({
    standalone: false,
    template: `
        <div class="btn-group">
            <button class="btn btn-xs btn-icon btn-rounded" [class.text-primary]="context.notification?.notifyOnEnter" (click)="onNotification(context)" title="Notification">
                <i class="fa fa-bell"></i>
            </button>
            <button class="btn btn-xs btn-icon btn-rounded" (click)="onEdit(context)" title="Edit">
                <i class="fa fa-pencil"></i>
            </button>
        </div>
    `
})
export class PhaseStepTaskActionCell extends DynamicComponent {
    private parent: any;

    agInit(params: any) {
        this.parent = params.context.componentParent;
        // @ts-ignore
        this.context = params.data;
    }

    onNotification(task: OrgWorkflowPhaseStepTask){
        this.parent.onNotification(task);
    }
    onEdit(task: OrgWorkflowPhaseStepTask){
        this.parent.actionCb(task);
    }
}
