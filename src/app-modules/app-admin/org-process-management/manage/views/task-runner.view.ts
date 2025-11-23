import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FullDateFormatCell, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {OrgTaskSummaryService} from "../services/org-process-task.service";
import {
    TaskNextScheduleRunCell, TaskSummaryNameActionCell
} from "../grid-cells/task-summary-grid-cell.component";
import {PipelineAPIResolver} from "../resolver/api.resolver";
import {OrgTaskSummaryRow, OrgTaskSummaryRowQueryOptions} from "../domains/org-task-summary.serializer";
import {TriggerCellComponent} from "../grid-cells/task-grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/task.html',
  styles: [':host { display: contents; }']
})
export class TaskRunnerView extends ViewExtender<OrgTaskSummaryRow> implements OnInit {
  override coreState: OrgTaskSummaryRowQueryOptions = new OrgTaskSummaryRowQueryOptions();
  constructor(public override service: OrgTaskSummaryService,
              public router: Router,
              public override activatedRoute: ActivatedRoute,
              public apiResolver: PipelineAPIResolver) {
    super(activatedRoute, service);
    this.gridOptions.header.edit = false;
    this.gridOptions.columnDefs = [
        {headerName: 'Name', cellTemplate: TaskSummaryNameActionCell},
        {headerName: 'Triggers', field: 'triggers', cellTemplate: TriggerCellComponent},
        //{headerName: 'Reminders', field: 'notifications', cellTemplate: ReminderCellComponent},
        //{headerName: 'Name', field: 'name', cellFn: (row)=> `${row.name}`},
        // {headerName: 'Triggers', field: 'totalTaskSchedules', cellFn: (row)=> `${row.totalTaskSchedules || '--'}`},
        // {headerName: 'Reminders', field: 'totalTaskSchedules', cellFn: (row)=> `${row.totalTaskReminders || '--'}`},
        // {headerName: 'Calendars', field: 'totalTaskCalendars', cellFn: (row)=> `${row.totalTaskCalendars || '--'}`},

        // {headerName: 'Assigned To', field: 'assignedToName'},
        // {headerName: 'Reported To', field: 'reportedToName'},
        // {headerName: 'Verified By', field: 'verifiedByName'},

        {headerName: 'Due Date', field: 'nextDueDate', cellTemplate: FullDateFormatCell },
        {headerName: 'Next Run', field: 'nextDueRun', cellTemplate: TaskNextScheduleRunCell}
    ];
  }

  ngOnInit(){
    super.populateGrid();
  }

    actionCb(row: OrgTaskSummaryRow) {
        const {id, name} = row;
        const inputData: any = { id: id, orgTaskId: id, data: row };
        const popupHeaderOptions = { text: `${name}`, desc: `` };
        this.apiResolver.ceOrgTaskPopup(inputData, popupHeaderOptions, ()=>{});
    }
}
