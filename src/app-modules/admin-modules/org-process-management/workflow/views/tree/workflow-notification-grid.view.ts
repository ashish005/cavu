import {Component, Optional} from "@angular/core";
import {OrgWorkflowView} from "../workflow.view";
import {ASIDE_CLASS, ASIDE_SIZE, OrgWorkflowAPIResolver, SharedService} from "@app-global";
import {NotificationWizardComponent} from "../../components";
import {of} from "rxjs";
import {WorkflowService} from "../../services/workflow.service";

@Component({
  standalone: false,
  templateUrl: './templates/workflow-notification-grid.html'
})
export class OrgWorkflowNotificationGridView {
    constructor(
        @Optional() public parent: OrgWorkflowView,
        private sharedService: SharedService,
        private lookup: OrgWorkflowAPIResolver,
        private workflowService: WorkflowService
    ) {}

    onProcessNotification() {
        if (!this.parent?.selectedProcess) return of(true);
        const process: any = this.parent.selectedProcess;
        const input = {
            context: 'process',
            process: this.parent.selectedProcess,
            userTypes: this.lookup.masterType.userTypes,
            notificationTypes: this.lookup.masterType.notificationTypes,
            userRoles: this.lookup.masterType.userRoles,
            settings: {
                notifications: process.notifications || [],
                workflowEvents: this.lookup.masterType.workflowEvents
            }
        };
        const popupHeaderOption = {
            text: `Notification Wizard: ${this.parent.selectedProcess.name}`,
            desc: `Process Level`
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => {
            if (resp && resp.notifications && this.parent?.selectedProcess) {
                const updatedProcess = {
                    ...this.parent.selectedProcess,
                    notifications: resp.notifications
                };
                this.workflowService.update(this.parent.selectedProcess.id, updatedProcess as any).subscribe();
                Object.assign(this.parent.selectedProcess, updatedProcess);
            }
            this.sharedService.destroy();
        };
        const failure = () => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
    }
}
