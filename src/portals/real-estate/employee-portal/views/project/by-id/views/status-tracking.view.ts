import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StatusTracking, StatusTrackingQueryOptions} from "../domains/status-tracking.serializer";
import {ProjectAPIResolver, ProjectStatusTrackingService} from "../services";
import {DateFormatCell, ViewExtender} from "@app-global";

@Component({
  standalone: false,
    selector: 'status-tracking',
    templateUrl: './templates/default-view.html'
})
export class StatusTrackingView extends ViewExtender<StatusTracking> implements OnInit{
    projectId: string;
    accountId: string;
    override coreState: StatusTrackingQueryOptions = new StatusTrackingQueryOptions();
    constructor(public override service: ProjectStatusTrackingService, public projectResolver: ProjectAPIResolver,
                private router: Router, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'From Date', field: 'fromDate', cellTemplate: DateFormatCell },
            {headerName: 'To Date', field: 'toDate', cellTemplate: DateFormatCell },
            {headerName: 'Process', field: 'process' },
            {headerName: 'Status', field: 'phase' },
            {headerName: 'Status Type', field: 'statusType' }
        ];
    }

    ngOnInit(){
        this.coreState.projectId = this.projectId;
        this.coreState.accountId = this.accountId;
        // const proj: Project = this.projectResolver.project;
        // (<any>this.coreState).moduleId = null;//proj.moduleId;
        super.populateGrid();
    }
    addNew(){}
  actionCb(e: any){}
}
