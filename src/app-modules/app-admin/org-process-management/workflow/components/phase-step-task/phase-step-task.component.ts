// import {Component, Injectable, Injector, Input, OnInit, OnChanges, SimpleChanges} from "@angular/core";
// import {ActivatedRoute, Router} from "@angular/router";
// import {
//     PhaseStepTask,
//     PhaseStepTaskQueryOptions,
//     PhaseStepTaskSerializer
// } from "../../domains/phase-step-task.serializer";
// import {PhaseStep, WorkflowNode} from "../../domains/org-workflow-node.serializer";
// import {PhaseStepTaskEditorComponent} from "../phase-step-task-editor/phase-step-task-editor.component";
// import {NotificationWizardComponent} from "../notification-wizard/notification-wizard.component";
// import {
//     ViewExtender, OrgResourceService, GridUISwitchCellComponent,
//     ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgWorkflowAPIResolver, DynamicComponent
// } from "@app-global";
//
// @Injectable()
// export class PhaseStepTaskService extends OrgResourceService<PhaseStepTask>{
//     constructor(public override injector: Injector) {
//         super(injector, 'phaseStepTask', new PhaseStepTaskSerializer());
//     }
// }
//
// @Component({
//     standalone: false,
//     template: `
//       <div class="btn-group">
//         <button class="btn btn-xs btn-icon btn-rounded" [class.text-primary]="context.notification?.notifyOnEnter" (click)="onNotification(context)" title="Notification">
//             <i class="fa fa-bell"></i>
//         </button>
//         <button class="btn btn-xs btn-icon btn-rounded" (click)="onEdit(context)" title="Edit">
//             <i class="fa fa-pencil"></i>
//         </button>
//       </div>
//     `
// })
// export class PhaseStepTaskActionCell extends DynamicComponent {
//     constructor(private parent: PhaseStepTaskComponent){
//         super();
//     }
//     onNotification(task: PhaseStepTask){
//         this.parent.onNotification(task);
//     }
//     onEdit(task: PhaseStepTask){
//         this.parent.actionCb(task);
//     }
// }
//
// @Component({
//   standalone: false,
//   selector: 'phase-task-grid',
//   templateUrl: './phase-step-task.html',
//   styles: [':host { display: contents; }'],
//   providers: [PhaseStepTaskService]
// })
// export class PhaseStepTaskComponent extends ViewExtender<PhaseStepTask> implements OnInit, OnChanges {
//   @Input() process?: WorkflowNode;
//   @Input() step?: PhaseStep | null;
//   override coreState: PhaseStepTaskQueryOptions = new PhaseStepTaskQueryOptions();
//   constructor(public override service: PhaseStepTaskService, public override activatedRoute: ActivatedRoute, private sharedService: SharedService, private lookup: OrgWorkflowAPIResolver) {
//     super(activatedRoute, service);
//     this.gridOptions.columnDefs = [
//         {headerName: 'Name', field: 'name'},
//         {headerName: 'Step', field: 'phaseStepName'},
//         {headerName: 'Frequency', field: 'frequencyTypeName'},
//         {headerName: 'Priority', field: 'taskPriorityName'},
//         {headerName: 'Manual', field: 'isManual', cellTemplate: GridUISwitchCellComponent},
//         {headerName: 'Primary', field: 'isPrimary', cellTemplate: GridUISwitchCellComponent},
//         {headerName: 'Verify', field: 'isVerificationRequired', cellTemplate: GridUISwitchCellComponent},
//         {headerName: 'StatusOnMail', field: 'isStatusOnMailRequired', cellTemplate: GridUISwitchCellComponent},
//         {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent},
//         {headerName: 'Action', cellTemplate: PhaseStepTaskActionCell, width: 80, pinned: 'right'}
//     ];
//     this.gridOptions.context = { componentParent: this };
//   }
//
//   ngOnInit(){
//     this.coreState.workflowId = this.process?.id || 0;
//     if (this.step && this.step.id) {
//       this.coreState.phaseStepId = this.step.id;
//     }
//     super.populateGrid();
//   }
//
//   ngOnChanges(changes: SimpleChanges) {
//       if(changes['process'] && !changes['process'].firstChange){
//           this.coreState.workflowId = this.process?.id || 0;
//           if (this.step) {
//               this.coreState.phaseStepId = this.step.id;
//           }
//           this.populateGrid();
//       }
//       if (changes['step'] && !changes['step'].firstChange) {
//           this.coreState.workflowId = this.process?.id || 0;
//           this.coreState.phaseStepId = this.step ? this.step.id : undefined;
//           this.populateGrid();
//       }
//   }
//
//   onNotification(task: PhaseStepTask) {
//     const input = {
//       context: 'task',
//       process: this.process,
//       task: task,
//       userTypes: this.lookup.masterType.userTypes,
//       notificationTypes: this.lookup.masterType.notificationTypes,
//       userRoles: this.lookup.masterType.userRoles,
//       settings: {
//         notifications: task.notifications || [],
//         workflowEvents: this.lookup.masterType.workflowEvents
//       }
//     };
//     const popupHeaderOption = {
//       text: `${task.name} Notifications`,
//       desc: this.process ? this.process.name : ''
//     };
//     const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
//     const success = (resp: any) => {
//       if (resp && resp.notifications) {
//           const updatedTask = {
//             ...task,
//             notifications: resp.notifications
//           };
//           this.service.update(task.id, updatedTask).subscribe(() => {
//               this.populateGrid();
//           });
//       }
//       this.sharedService.destroy();
//     };
//     const failure = () => { this.sharedService.destroy(); };
//     this.sharedService.showCustomPopup(NotificationWizardComponent, popupOptions, input).then(success, failure);
//   }
//
//   addTask() {
//     if (!this.process || !this.step) {
//       return;
//     }
//     const popupHeaderOption = {
//       text: "New Task",
//       desc: this.process ? this.process.name : ""
//     };
//     const input = {
//       process: this.process,
//       step: this.step
//     };
//     const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
//     const success = () => {
//       this.sharedService.destroy();
//       this.populateGrid();
//     };
//     const failure = () => {
//       this.sharedService.destroy();
//     };
//     this.sharedService.showCustomPopup(PhaseStepTaskEditorComponent, popupOptions, input).then(success, failure);
//   }
//
//   actionCb(row: PhaseStepTask) {
//     const popupHeaderOption = {
//       text: row.name || "",
//       desc: this.process ? this.process.name : ""
//     };
//     const input = {
//       process: this.process,
//       step: this.step,
//       task: row
//     };
//     const popupOptions = { header: popupHeaderOption, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
//     const success = () => {
//       this.sharedService.destroy();
//       this.populateGrid();
//     };
//     const failure = () => {
//       this.sharedService.destroy();
//     };
//     this.sharedService.showCustomPopup(PhaseStepTaskEditorComponent, popupOptions, input).then(success, failure);
//   }
// }
