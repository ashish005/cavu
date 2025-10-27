///<reference path="../grid-cells/task-grid-cell.component.ts"/>
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OrgTask, OrgTaskQueryOptions} from "../domains/org-task.serializer";
import {SharedService, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {OrgTaskService} from "../services/org-process-task.service";
import {
    ReminderCellComponent,
    TaskNameActionCell, TriggerCellComponent
} from "../grid-cells/task-grid-cell.component";
import {PipelineAPIResolver} from "../resolver/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/task.html',
  styles: [':host { display: contents; }']
})
export class OrgTaskView extends ViewExtender<OrgTask> implements OnInit {
  override coreState: OrgTaskQueryOptions = new OrgTaskQueryOptions();
  constructor(public override service: OrgTaskService,
              public router: Router, public sharedService: SharedService,
              public override activatedRoute: ActivatedRoute,
              public apiResolver: PipelineAPIResolver) {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
        {headerName: 'Name', cellTemplate: TaskNameActionCell},
        {headerName: 'Triggers', field: 'triggers', cellTemplate: TriggerCellComponent},
        {headerName: 'Reminders', field: 'notifications', cellTemplate: ReminderCellComponent},
        {headerName: 'Frequency', field: 'defaultFrequencyTypeName'},
        {headerName: 'Priority', field: 'taskPriorityName'},
        {headerName: 'Manual', field: 'isManual', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Primary', field: 'isPrimary', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Verify', field: 'isVerificationRequired', cellTemplate: GridUISwitchCellComponent},
        /*{headerName: 'Assigned To', field: 'assignedToName'},
        {headerName: 'Reported To', field: 'reportedToName'},
        {headerName: 'Verified By', field: 'verifiedByName'},*/
        {headerName: 'StatusOnMail', field: 'isStatusOnMailRequired', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Daily', field: 'isStatusOnMailDaily', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Weekly', field: 'isStatusOnMailWeekly', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Monthly', field: 'isStatusOnMailMonthly', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit(){
    super.populateGrid();
  }

    actionCb(row: OrgTask) {
        const {id, name} = row;
        const inputData: any = {
            id: id,
            orgTaskId: id,
            data: row
        };
        const popupHeaderOptions = { text: `${name}`, desc: `` };
      // this.pluginFactory.showTaskCEPopup(inputData, popupHeaderOptions, ()=>{});
    }
    addRecord(){
        const inputData: any = {
            id: null,
            orgTaskId: null,
            data: {}
        };
        const popupHeaderOptions = { text: `new Task`, desc: `` };
        // this.pluginFactory.showTaskCEPopup(inputData, popupHeaderOptions, ()=>{});
    }
  /*actionCb(row: OrgTask){
    const {id, name} = row;
    const inputData: any = {
        id: id,
        orgTaskId: id,
        data: {}
    };
    const popupHeaderOptions = { text: `${name}`, desc: `` };

    const success = (resp: any) => { this.populateGrid(); this.sharedService.destroy(); };
    const error = (resp: any) => { this.sharedService.destroy(); };
    this.apiResolver.showEventTaskPopup(inputData, popupHeaderOptions);
  }

  addRecord(){
    const inputData: any = {
        id: null,
        orgTaskId: null,
        data: {}
    };
    const popupHeaderOptions = { text: `New Org Task`, desc: `` };
    this.apiResolver.showEventTaskPopup(inputData, popupHeaderOptions);
  }*/
}
