import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CoreProcessFactory, GridUISwitchCellComponent, ViewExtender} from "@app-global";
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
    constructor(public router: Router, public override activatedRoute: ActivatedRoute,
                public override service: OrgProcessService,
                private pluginFactory: CoreProcessFactory){
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Org Process', desc: 'Org Process', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: '', field: 'workFlow', cellTemplate: ProcessWorkFlowCellComponent },
            {headerName: 'Name', field: 'name' },
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
        this.pluginFactory.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            super.populateGrid();
        });
    }
}
