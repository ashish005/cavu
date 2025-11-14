import {WorkflowWithPhaseView} from "./views/workflow-with-phase.view";
import {WorkflowWithTaskView} from "./views/workflow-with-task.view";
import {SetupWorkflowView} from "./views/setup-workflow.view";
import {Injectable, Injector} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
export const WORKFLOW_COMPONENTS = [
    WorkflowWithPhaseView, WorkflowWithTaskView, SetupWorkflowView
];

@Injectable()
export class CoreProcessFactory {
    sharedService: SharedService;
    constructor(public injector: Injector) { this.sharedService = injector.get(SharedService); }
    showOrgWorkflowPopup(data: any, popupHeaderOption: any, cb){
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        this.showPopup(WorkflowWithTaskView, popupOptions, data).then(success, failure);
    }
    private showPopup = (component: any, popupOptions: any, data: any) => this.sharedService.showCustomPopup(WorkflowWithTaskView, popupOptions, data);
    private destroy = () => this.sharedService.destroy();
}