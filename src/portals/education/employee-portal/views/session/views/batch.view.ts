import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Batch, BatchQueryOptions} from "../domains/batch.serializer";
import {OrgBatchService} from "../services/org-batch.service";
import {SessionAPIResolver} from "../services/api.resolver";
import {DateFormatCell, ViewExtender} from "@app-global";
import {CourseFeePlanGridCell} from "../grid-cells/batch-grid-cell.component";

@Component({ standalone: false, templateUrl: './templates/batch.html' })
export class BatchView extends ViewExtender<Batch> implements OnInit{
  override coreState: BatchQueryOptions = new BatchQueryOptions();
  constructor(public override service: OrgBatchService,
              public lookupResolver: SessionAPIResolver,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
        {headerName: 'Fee Plans', field: '', cellTemplate: CourseFeePlanGridCell },
        {headerName: 'Name', field: 'name' },
        {headerName: 'Start Date', field: 'startDate', cellTemplate: DateFormatCell },
        {headerName: 'Study Mode', field: 'studyModeTypeName' },
        {headerName: 'Session', field: 'orgSessionName' },
        {headerName: 'Status', field: 'status' }
    ];
  }

  ngOnInit(){
      this.activatedRoute.params.subscribe(routeParams => {
          this.coreState.sessionId = routeParams['sessionId'];
          this.populateGrid();
      });
  }

    showFeeTypesMasterPopup=()=> {}//this.feePlanFactory.showFeeTypesMasterPopup(()=> this.refreshGrid());

    showConcessionFeeMasterPopup=()=> {}//this.feePlanFactory.showConcessionFeeMasterPopup(()=> this.refreshGrid());

    showFeePenaltyMasterPopup=()=> {}//this.feePlanFactory.showFeePenaltyMasterPopup(()=> this.refreshGrid());

    override refreshGrid = () => { super.populateGrid(); }

  /*addBatch(){
      const inputData: any = {
          id: null,
          data: new Batch()
      };
      this.lookupResolver.addUpdateBatchPopup(inputData, { text: `New Batch`, desc: '' }, this.refreshGrid);
  }*/

    updateBatch(row: Batch){
        const inputData: any = {
            id: row.id,
            data: row
        };
        this.lookupResolver.addUpdateBatchPopup(inputData, { text: `Batch ${row.name}`, desc: '' }, this.refreshGrid);
    }
}
