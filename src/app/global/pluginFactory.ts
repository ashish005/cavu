import {Injectable, Injector} from "@angular/core";
import {SharedService} from "./shared.service";
import {ASIDE_CLASS, ASIDE_SIZE} from "./popup-module/app-popup.enum";
import {WorkflowWithTaskView} from "./modules/org-process/workflow/views/workflow-with-task.view";
import {OrgProcessCeView} from "./modules/org-process/process-ce";
import {OrgWorkflowAPIResolver} from "./services";
import {WorkflowWithPhaseView} from "./modules/org-process/workflow/views/workflow-with-phase.view";
@Injectable()
export class CoreProcessFactory {
    sharedService: SharedService;
    constructor(public injector: Injector, private workflowResolver: OrgWorkflowAPIResolver) {
        this.sharedService = injector.get(SharedService);
    }
    ceProcessPopup=(data: any, popupHeaderOption: any, cb)=> {
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption || { text: `Process`, desc: 'Process' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        const callApi = () => this.showPopup(OrgProcessCeView, popupOptions, data);
        return this.workflowResolver.lookupResolver()
            .then(()=> callApi().then(success, failure));
    }
    showPhaseWorkflowPopup=(data: any, popupHeaderOption: any, cb)=>{
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        this.showPopup(WorkflowWithPhaseView, popupOptions, data).then(success, failure);
    }
    showTaskWorkflowPopup=(data: any, popupHeaderOption: any, cb)=>{
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        this.showPopup(WorkflowWithTaskView, popupOptions, data).then(success, failure);
    }
    private showPopup = (component: any, popupOptions: any, data: any) => this.sharedService.showCustomPopup(component, popupOptions, data);
    private destroy = () => this.sharedService.destroy();
}