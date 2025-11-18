import {Injectable, Injector} from "@angular/core";
import {SharedService} from "./shared.service";
import {ASIDE_CLASS, ASIDE_SIZE} from "./popup-module/app-popup.enum";
import {OrgWorkflowAPIResolver} from "./services";
@Injectable()
export class CoreProcessFactory {
    sharedService: SharedService;
    constructor(public injector: Injector, private workflowResolver: OrgWorkflowAPIResolver) {
        this.sharedService = injector.get(SharedService);
    }
    /*
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
    }*/
    private showPopup = (component: any, popupOptions: any, data: any) => this.sharedService.showCustomPopup(component, popupOptions, data);
    private destroy = () => this.sharedService.destroy();
}