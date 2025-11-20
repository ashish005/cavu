import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskCalendarService} from "../services/task-calendar.service";
import {
    CalendarEndDateCell,
    CalendarNameActionCell,
    CalendarStartDateCell
} from "../grid-cells/task-calendar-grid-cell.component";
import {ViewExtender} from "@app-global";
import { OrgTaskCalendarQueryOptions, OrgTaskCalendar } from "../domains/org-task-calendar.serializer";
import {PipelineAPIResolver} from "../resolver/api.resolver";

@Component({
  standalone: false,
  templateUrl: './templates/task-calendar.html'
})
export class TaskCalendarView extends ViewExtender<OrgTaskCalendar> implements OnInit, OnDestroy {
  override coreState: OrgTaskCalendarQueryOptions = new OrgTaskCalendarQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: TaskCalendarService,
              public lookupResolver: PipelineAPIResolver){
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', cellTemplate: CalendarNameActionCell },
            {headerName: 'Incharge', field: 'inchargeName'},
            {headerName: 'Start Time', cellTemplate: CalendarStartDateCell },
            {headerName: 'End Time', cellTemplate: CalendarEndDateCell }
        ];
    }
    onActivate(componentRef){
      this.actionTemplate = componentRef.actionTemplate;
    }
    override ngOnDestroy(){ super.ngOnDestroy(); }
    ngOnInit(){
        //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
      super.populateGrid();
    }
    actionCb(data: OrgTaskCalendar){
        const { id, taskName,  orgTaskId } = data;
        const popupHeaderOption = { text: `Calendar for ${taskName}`, desc: `Calendar` };
        const inputData: any = {
            id: id,// calendar id
            orgTaskId: orgTaskId,
            data: data
        };
        this.lookupResolver.showTaskCalendarPopup(inputData, popupHeaderOption);
    }
}
