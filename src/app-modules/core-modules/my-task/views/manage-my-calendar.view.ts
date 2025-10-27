import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {MyTaskAPIResolver} from "../services/api.resolver";
import {
    CalendarEndDateCell,
    CalendarNameActionCell,
    CalendarStartDateCell
} from "../grid-cells/org-calendar-grid-cell.component";
import {MyCalendar, MyCalendarQueryOptions} from "../domains/my-task/my-calendar.serializer";
import {MyCalendarService} from "../services/my-calendar.service";

@Component({
  standalone: false,
  templateUrl: './templates/org-calendar.html'
})
export class ManageMyCalendarView extends ViewExtender<MyCalendar> implements OnInit, OnDestroy {
  override coreState: MyCalendarQueryOptions = new MyCalendarQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: MyCalendarService,
                public apiResolver: MyTaskAPIResolver) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', cellTemplate: CalendarNameActionCell },
            {headerName: 'Incharge', field: 'inchargeName'},
            {headerName: 'Start Time', cellTemplate: CalendarStartDateCell },
            {headerName: 'End Time', cellTemplate: CalendarEndDateCell }
        ];
    }

    //onActivate(componentRef){ super.actionTemplate = componentRef.actionTemplate; }

    override ngOnDestroy(){ super.ngOnDestroy(); }

    ngOnInit(){
        //this.orgTaskId = this.activatedRoute.snapshot.params.taskId;
        //this.coreState.orgUserId = this.coreService.currentUser.id;
        super.populateGrid();
    }

    actionCb(data: MyCalendar){
        const { id, taskName,  orgTaskId } = data;
        const popupHeaderOption = { text: `Calendar for ${taskName}`, desc: `Calendar` };
        const inputData: any = {
            id: id,// calendar id
            orgTaskId: orgTaskId,
            data: data
        };
        this.apiResolver.showOrgCalendarPopup(inputData, popupHeaderOption);
    }
}
