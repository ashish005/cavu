import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {OrgProcess, OrgProcessQueryOptions} from "../domains/org-process.serializer";
import {OrgProcessService} from "../services/org-process.service";
import {ProcessWorkFlowCellComponent} from "../grid-cells/process-grid-cell.component";

@Component({
  standalone: false,
  templateUrl: './templates/process.html',
  styles: [`:host {display: contents;}`]
})
export class ProcessView extends ViewExtender<OrgProcess> implements OnInit, OnDestroy {
  override coreState: OrgProcessQueryOptions = new OrgProcessQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public override service: OrgProcessService){
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Org Process', desc: 'Org Process information here', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'WorkFlow', field: 'workFlow', cellTemplate: ProcessWorkFlowCellComponent },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Description', field: 'description' },
            {headerName: 'Parent', field: 'parentName' },

            // {headerName: 'Phase', field: 'processPhase' },
            // {headerName: 'Phase On', field: 'processPhaseOn', cellTemplate: DateFormatCell },
            // {headerName: 'Status', field: 'manualStatus' },
            // {headerName: 'Status On', field: 'manualStatusOn', cellTemplate: DateFormatCell },
            {headerName: 'Sub Processes', field: 'totalSubProcesses' },
            {headerName: 'Tasks', field: 'totalTaskCount' },
            {headerName: 'Incharge', field: 'inchargeName' },
            {headerName: 'Status', field: 'status' },
        ];
    }

    ngOnInit(){ super.populateGrid(); }

    actionCb(row: OrgProcess) {
        const {id, parentId, name} = row;
        const inputData: any = {
            id: id,
            parentId: parentId,
            data: row
        };
        const popupHeaderOptions = { text: `${name}`, desc: `` };
        /*this.pluginFactory.showProessCEPopup(inputData, popupHeaderOptions, ()=>{
            super.populateGrid();
        });*/
    }
}
