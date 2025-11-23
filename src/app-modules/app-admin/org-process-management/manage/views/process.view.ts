import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, SharedService, ViewExtender} from "@app-global";
import {OrgProcess, OrgProcessQueryOptions} from "../domains/org-process.serializer";
import {OrgProcessService} from "../services/org-process.service";
import {ProcessWorkFlowCellComponent} from "../grid-cells/process-grid-cell.component";
import {PipelineAPIResolver} from "../resolver/api.resolver";
@Component({
  standalone: false,
  templateUrl: './templates/process.html',
  styles: [`:host {display: contents;}`]
})
export class ProcessView extends ViewExtender<OrgProcess> implements OnInit, OnDestroy {
  override coreState: OrgProcessQueryOptions = new OrgProcessQueryOptions();
    constructor(public router: Router, private apiResolver: PipelineAPIResolver,
                public override activatedRoute: ActivatedRoute,
                public override service: OrgProcessService){
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Org Process', desc: 'Org Process', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Parent', field: 'parentName' },
            {headerName: 'Phases', field: 'workFlow', cellTemplate: ProcessWorkFlowCellComponent },
            {headerName: 'ProcessStatus', field: 'processStatus' },
            // {headerName: 'Phase', field: 'processPhase' },
            // {headerName: 'Phase On', field: 'processPhaseOn', cellTemplate: DateFormatCell },
            // {headerName: 'Status', field: 'manualStatus' },
            // {headerName: 'Status On', field: 'manualStatusOn', cellTemplate: DateFormatCell },
            {headerName: 'Incharge', field: 'inchargeName' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }
    ngOnInit(){ super.populateGrid(); }
    actionCb(row: OrgProcess) {
        const {id, parentId, name, description} = row;
        const inputData: any = { id: id, parentId: parentId, data: row };
        const popupHeaderOptions = { text: `${name}`, desc: `${description}` };
        this.apiResolver.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            super.populateGrid();
        });
    }
}
