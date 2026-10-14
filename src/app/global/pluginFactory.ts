import {Injectable, Injector} from "@angular/core";
import {SharedService} from "./shared.service";
import {ASIDE_CLASS, ASIDE_SIZE} from "./popup-module/app-popup.enum";
import {TestSchedulerCalenderView} from "./modules/task-scheduler/test-scheduler-calender.view";
import {TaskActivityComponent} from "./modules/task-scheduler/task-activity.component";
import {EntityWorkflowPanelComponent} from "./modules/entity-workflow/entity-workflow-panel.component";
import {EntityRef} from "./modules/entity-workflow/entity-workflow.service";

/** Popups other modules use to attach processes, tasks and schedules to their records. */
@Injectable()
export class CoreProcessFactory {
    sharedService: SharedService;
    constructor(public injector: Injector) {
        this.sharedService = injector.get(SharedService);
    }

    /**
     * Processes, open tasks and schedules of one record, with start-a-workflow / add-task / repeat actions.
     * `entity.type` is a lowercase code (e.g. 'compliance', 'purchase_order'); triggers and stage rules use the same code.
     */
    showEntityWorkflow(entity: EntityRef, popupHeaderOptions: any = {text: 'Workflow', desc: entity?.name ?? ''}) {
        const popupOptions = {header: popupHeaderOptions, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50};
        return this.showPopup(EntityWorkflowPanelComponent, popupOptions, {entity})
            .then(() => this.destroy(), () => this.destroy());
    }

    /**
     * @deprecated Schedules are now linked to the record itself; this opens {@link showEntityWorkflow}.
     * `data` must carry `entity` ({type, id, name}); the callback runs when the popup closes.
     */
    showSchedulerPopup(data: {entity: EntityRef}, popupHeaderOptions: any, cb?: (resp?: any) => void) {
        return this.showEntityWorkflow(data.entity, popupHeaderOptions).then(() => cb?.());
    }

    showFrequencyCalenderTestPopup(data: any, popupHeaderOption: any){
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75 };
        const success = (resp: any) => { this.destroy(); };
        const failure = (e) => { this.destroy(); };
        return this.sharedService.showCustomPopup(TestSchedulerCalenderView, popupOptions, data).then(success, failure);
    }

    showTaskActivityPopup(data, popupHeaderOption){
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption || { text: `Process`, desc: 'Process' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.sharedService.destroy(); };
        const failure = (e) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(TaskActivityComponent, popupOptions, data).then(success, failure);
    }
    private showPopup = (component: any, popupOptions: any, data: any) => this.sharedService.showCustomPopup(component, popupOptions, data);
    private destroy = () => this.sharedService.destroy();
}
