import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DateFormatCell, GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {OrgProcess, OrgProcessQueryOptions} from "../domains/org-process.serializer";
import {OrgProcessService} from "../services/org-process.service";

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
        this.gridOptions.header = { title: 'Org Process', desc: 'Org Process', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Phase', field: 'processPhase', cellFn: (row)=> `${row.processPhase + ' -> ' +  row.processPhaseStep}` },
            {headerName: 'Status', field: 'processStatus' },
            {headerName: 'As On', field: 'phaseStepOn', cellTemplate: DateFormatCell },
            {headerName: 'Incharge', field: 'inchargeName' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }
    ngOnInit(){ super.populateGrid(); }
    actionCb(row: OrgProcess) {
        const {id, name} = row;
        const inputData: any = { id: id, data: row };
        const popupHeaderOptions = { text: `${name}` };
        /*this.apiResolver.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            super.populateGrid();
        });*/
    }
}
