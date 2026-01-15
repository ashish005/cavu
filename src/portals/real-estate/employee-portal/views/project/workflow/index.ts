import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Injectable, Injector, ModuleWithProviders, NgModule, OnInit} from "@angular/core";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, CoreModule, SharedService} from "@app-global";
import {ProjectWorkflowManageView} from "./views/project/project-workflow-manage.view";
import {ProjectWorkflowService} from "./services/project-workflow.service";
import {ProjectWorkflowLayout} from "./layout/project-workflow.layout";
import {WORKFLOW_COMPONENTS} from "./components";
import {ProjectStageManageView} from "./views/project/project-stage-manage.view";
import {ProjectStagesService} from "./services/project-stages.service";
import {WORKFLOW_POPOVER_COMPONENTS} from "../../../../../../app/global/components/org/popover-component";
import {WorkflowPluginAPIResolver} from "./services/workflow.resolver";

@Injectable()
export class WorkflowPluginFactory {
    sharedService: SharedService;
    resolver: WorkflowPluginAPIResolver;
    constructor(public injector: Injector) {
        this.sharedService = injector.get(SharedService);
        this.resolver = injector.get(WorkflowPluginAPIResolver);
    }

    showProjectProcessStagesPopup(data: any, popupHeaderOptions: any){
        const popupOptions = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        data = data || {
            masterType: null,
            actionType: ACTION_ENUM.SHOW
        };
        //(data.masterType == ORG_PROCESS_TYPE.PROJECT_MANAGEMENT) {
        debugger
        return this.resolver.resolve().then(()=> this.sharedService.showCustomPopup(ProjectStageManageView, popupOptions, data));
    }

   showProjectWorkflowPopup(data: any, popupHeaderOptions: any){
        const popupOptions = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        data = data || { actionType: ACTION_ENUM.SHOW };
        return this.resolver.resolve().then(()=> this.sharedService.showCustomPopup(ProjectWorkflowManageView, popupOptions, data));
    }
    destroy(){ this.sharedService.destroy(); }
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule.forChild()
    ],
    providers: [
        WorkflowPluginFactory, WorkflowPluginAPIResolver,
        ProjectWorkflowService, ProjectStagesService
    ],
    declarations: [
        ProjectWorkflowLayout, ProjectWorkflowManageView, ProjectStageManageView,
        WORKFLOW_COMPONENTS, WORKFLOW_POPOVER_COMPONENTS
    ]
})
export class WorkflowPluginModule {}
