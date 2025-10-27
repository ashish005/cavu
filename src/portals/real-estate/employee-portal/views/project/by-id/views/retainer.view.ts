import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Retainer, RetainerQueryOptions, RetainerService} from "../services/project-client.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
  standalone: false,
    templateUrl: './templates/default-view.html'
})
export class RetainerView extends ViewExtender<Retainer> implements OnInit{
    projectId: string;
    accountId: string;
    coreState: RetainerQueryOptions = new RetainerQueryOptions();
    constructor(public override service: RetainerService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){
        this.coreState.projectId = this.projectId;
        this.coreState.accountId = this.accountId;
        super.populateGrid();
    }
    addNew(){}
}
