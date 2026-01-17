import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, SharedService, ViewExtender, ASIDE_CLASS, ASIDE_SIZE} from "@app-global";
import {OrgWorkflow, OrgWorkflowsQueryOptions} from "../domains/org-workflow.serializer";
import {WorkflowService} from "../services/workflow.service";
import {WorkflowGridCellComponent} from "../grid-cells/workflow-grid-cell.component";
import {WorkflowCeView} from "../components";

@Component({
  standalone: false,
  templateUrl: './templates/workflow-grid.html',
  styles: [`:host {display: contents;}`]
})
export class WorkflowGridView extends ViewExtender<OrgWorkflow> implements OnInit, OnDestroy {
  override coreState: OrgWorkflowsQueryOptions = new OrgWorkflowsQueryOptions();
    constructor(public router: Router, private sharedService: SharedService,
                public override activatedRoute: ActivatedRoute,
                public override service: WorkflowService){
        super(activatedRoute, service);
        this.gridOptions.header = { title: 'Org Process', desc: 'Org Process', add: true, refresh: true, edit: true, delete: false };
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Parent', field: 'parentName' },
            {headerName: 'Phases', field: 'workFlow', cellTemplate: WorkflowGridCellComponent },
            {headerName: 'Incharge', field: 'inchargeName' },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }
    ngOnInit(){ super.populateGrid(); }
    actionCb(row: OrgWorkflow) {
        const {id, parentId, name, description} = row;
        const inputData: any = { id: id, parentId: parentId, data: row };
        const popupHeaderOptions = { text: `${name}`, desc: `${description}` };
        this.ceProcessPopup(inputData, popupHeaderOptions, ()=>{
            super.populateGrid();
        });
    }

    ceProcessPopup=(data: any, popupHeaderOption: any, cb)=> {
        data = data || { id: null, data: null };
        const popupOptions = { header: popupHeaderOption || { text: `Process`, desc: 'Process' }, aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_50 };
        const success = (resp: any) => { this.sharedService.destroy(); cb(); };
        const failure = (e) => { this.sharedService.destroy(); };
        return this.sharedService.showCustomPopup(WorkflowCeView, popupOptions, data).then(success, failure);
    }
}
