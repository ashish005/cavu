import {Component, Injectable, Injector, Input, OnChanges, OnInit, Optional, SimpleChanges, OnDestroy} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OrgWorkflowView} from "../workflow.view";
import {
    ASIDE_CLASS,
    ASIDE_SIZE, DynamicComponent,
    GridUISwitchCellComponent, OrgResourceService,
    OrgWorkflowAPIResolver,
    SharedService,
    ViewExtender,
    GlobalModule, GRID_COMPONENT
} from "@app-global";
import {
    OrgWorkflowPhaseStepTask,
    OrgWorkflowPhaseStepTaskQueryOptions,
    OrgWorkflowPhaseStepTaskSerializer
} from "../../domains/phase-step-task.serializer";
import {OrgWorkflowPhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {ActivatedRoute} from "@angular/router";
import {
    NotificationWizardComponent,
    PhaseStepTaskEditorComponent
} from "../../components";
import {Subscription} from "rxjs";
import {OrgWorkflowPhaseStepTaskService} from "../../services/workflow.service";

@Component({
    standalone: true,
    imports: [CommonModule, GlobalModule],
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

@Component({
  standalone: true,
  imports: [CommonModule, GlobalModule, PhaseStepTaskActionCell, GRID_COMPONENT],
  templateUrl: './templates/workflow-task-grid.html',
    styles: [':host { display: contents; }'],
    providers: [OrgWorkflowPhaseStepTaskService]
})
export class OrgWorkflowTaskGridView extends ViewExtender<OrgWorkflowPhaseStepTask> implements OnInit, OnChanges, OnDestroy {
    @Input() process?: WorkflowNode;
    @Input() step?: OrgWorkflowPhaseStep | null;
    override coreState: OrgWorkflowPhaseStepTaskQueryOptions = new OrgWorkflowPhaseStepTaskQueryOptions();
    private sub = new Subscription();

    constructor(public override service: OrgWorkflowPhaseStepTaskService, public override activatedRoute: ActivatedRoute, private sharedService: SharedService, private lookup: OrgWorkflowAPIResolver, @Optional() public parent: OrgWorkflowView) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name'},
            {headerName: 'Step', field: 'phaseStepName'},
            {headerName: 'Frequency', field: 'frequencyTypeName'},
            {headerName: 'Priority', field: 'taskPriorityName'},
            {headerName: 'Manual', field: 'isManual', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'Primary', field: 'isPrimary', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'Verify', field: 'isVerificationRequired', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'StatusOnMail', field: 'isStatusOnMailRequired', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent},
            {headerName: 'Action', cellTemplate: PhaseStepTaskActionCell, width: 80, pinned: 'right'}
        ];
        this.gridOptions.context = { componentParent: this };
    }

    ngOnInit(){
        if (this.parent) {
            this.sub.add(this.parent.selectedProcess$.subscribe(p => {
                if(p) {
                    this.process = p;
                    this.coreState.workflowId = p.id;
                    this.step = this.parent.selectedStepForTasks;
                    if (this.step && this.step.id) {
                        this.coreState.phaseStepId = this.step.id;
                    }
                    this.populateGrid();
                }
            }));
        } else {
            this.coreState.workflowId = this.process?.id || 0;
            if (this.step && this.step.id) {
                this.coreState.phaseStepId = this.step.id;
            }
            super.populateGrid();
        }
    }

    override ngOnDestroy() {
        this.sub.unsubscribe();
        super.ngOnDestroy();
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes['process'] && !changes['process'].firstChange){
            this.coreState.workflowId = this.process?.id || 0;
            if (this.step) {
                this.coreState.phaseStepId = this.step.id;
            }
            this.populateGrid();
        }
        if (changes['step'] && !changes['step'].firstChange) {
            this.coreState.workflowId = this.process?.id || 0;
            this.coreState.phaseStepId = this.step ? this.step.id : undefined;
            this.populateGrid();
        }
    }

    onNotification(task: OrgWorkflowPhaseStepTask) {
        const input = {
            context: 'task',
            process: this.process,
            task: task,
            userTypes: this.lookup.masterType.userTypes,
            notificationTypes: this.lookup.masterType.notificationTypes,
            userRoles: this.lookup.masterType.userRoles,
            settings: {
                notifications: task.notifications || [],
                workflowEvents: this.lookup.masterType.workflowEvents
            }
        };
        const popupHeaderOption = {
            text: `${task.name} Notifications`,
            desc: this.process ? this.process.name : ''
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => {
            if (resp && resp.notifications) {
                const updatedTask = {
                    ...task,
                    notifications: resp.notifications
                };
                this.service.update(task.id, updatedTask).subscribe(() => {
                    this.populateGrid();
                });
            }
            this.sharedService.destroy();
        };
        const failure = () => { this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
    }

    addTask() {
        if (!this.process) {
             if(this.parent && this.parent.selectedProcess) {
                 this.process = this.parent.selectedProcess;
             } else {
                 return;
             }
        }
        if (!this.step && this.parent && this.parent.selectedStepForTasks) {
            this.step = this.parent.selectedStepForTasks;
        }
        // if step is still null, it might be a process level task or allowed to be null? 
        // Assuming we need at least process.
        const popupHeaderOption = {
            text: "New Task",
            desc: this.process ? this.process.name : ""
        };
        const input = {
            process: this.process,
            step: this.step
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = () => {
            this.sharedService.destroy();
            this.populateGrid();
        };
        const failure = () => {
            this.sharedService.destroy();
        };
        this.sharedService.showCustomPopup(PhaseStepTaskEditorComponent, popupOptions, input).then(success, failure);
    }

    actionCb(row: OrgWorkflowPhaseStepTask) {
        const popupHeaderOption = {
            text: row.name || "",
            desc: this.process ? this.process.name : ""
        };
        const input = {
            process: this.process,
            step: this.step,
            task: row
        };
        const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = () => {
            this.sharedService.destroy();
            this.populateGrid();
        };
        const failure = () => {
            this.sharedService.destroy();
        };
        this.sharedService.showCustomPopup(PhaseStepTaskEditorComponent, popupOptions, input).then(success, failure);
    }

    clearFilter() {
        this.step = null;
        if (this.parent) {
            this.parent.selectedStepForTasks = null;
        }
        this.coreState.workflowId = this.process?.id || 0;
        this.coreState.phaseStepId = undefined;
        this.populateGrid();
    }
}
