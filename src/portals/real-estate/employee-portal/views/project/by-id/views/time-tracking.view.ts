import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {ProjectTimeTrackingService} from "../services/time-tracking.service";
import {TimeTracking, TimeTrackingQueryOptions} from "../domains/time-tracking.serializer";

@Component({
  standalone: false,
    templateUrl: './templates/default-view.html'
})
export class TimeTrackingView extends ViewExtender<TimeTracking> implements OnInit{
    projectId: string;
    accountId: string;
    override coreState: TimeTrackingQueryOptions = new TimeTrackingQueryOptions();
    constructor(public override service: ProjectTimeTrackingService,
                public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){
        (<any>this.coreState).projectId = this.projectId;
        (<any>this.coreState).accountId = this.accountId;
        super.populateGrid();
    }
    addNew(){}
  actionCb(e){}
}
