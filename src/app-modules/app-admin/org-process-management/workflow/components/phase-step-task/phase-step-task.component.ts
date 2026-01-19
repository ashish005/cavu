import {Component, Injectable, Injector, Input, OnInit, OnChanges, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
    PhaseStepTask,
    PhaseStepTaskQueryOptions,
    PhaseStepTaskSerializer
} from "../../domains/phase-step-task.serializer";
import {PhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
import {WorkflowNotificationTemplateComponent} from "../workflow-notification-template/workflow-notification-template.component";
import {PhaseStepTaskEditorComponent} from "../phase-step-task-editor/phase-step-task-editor.component";
import {
    ViewExtender, OrgResourceService, GridUISwitchCellComponent,
    ASIDE_CLASS, ASIDE_SIZE, SharedService
} from "@app-global";

@Injectable()
export class PhaseStepTaskService extends OrgResourceService<PhaseStepTask>{
    constructor(public override injector: Injector) {
        super(injector, 'phaseStepTask', new PhaseStepTaskSerializer());
    }
}

@Component({
  standalone: false,
  selector: 'phase-task-grid',
  templateUrl: './phase-step-task.html',
  styles: [':host { display: contents; }'],
  providers: [PhaseStepTaskService]
})
export class PhaseStepTaskComponent extends ViewExtender<PhaseStepTask> implements OnInit, OnChanges {
  @Input() process?: WorkflowNode;
  @Input() step?: PhaseStep | null;
  override coreState: PhaseStepTaskQueryOptions = new PhaseStepTaskQueryOptions();
  constructor(public override service: PhaseStepTaskService, public override activatedRoute: ActivatedRoute, private sharedService: SharedService) {
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
        {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit(){
    this.coreState.workflowId = this.process?.id || 0;
    if (this.step && this.step.id) {
      this.coreState.phaseStepId = this.step.id;
    }
    super.populateGrid();
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

  addTask() {
    if (!this.process || !this.step) {
      return;
    }
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

  actionCb(row: PhaseStepTask) {
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
}
