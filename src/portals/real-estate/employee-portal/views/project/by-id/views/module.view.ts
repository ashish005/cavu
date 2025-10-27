import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {
    DateFormatCell, NumberCell, GridUISwitchCellComponent, ViewExtender
} from "@app-global";
import {ProjectModule, ProjectModuleQueryOptions} from "../domains/project-module.serializer";
import {
    ProjectPipelineSetupCell,
    ServiceQuotationCell,
    ServiceSaleOrderCell
} from "../grid-cells/project-grid-cell.component";
import { ProjectAPIResolver, ProjectModuleService } from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/default-view.html'
})
export class ProjectModuleView extends ViewExtender<ProjectModule> implements OnInit{
  projectId: string;
  accountId: string;
  override coreState: ProjectModuleQueryOptions = new ProjectModuleQueryOptions();
  constructor(public override service: ProjectModuleService, public override activatedRoute: ActivatedRoute, public apiResolver: ProjectAPIResolver)
  {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'grid.header.name', field: 'name' },
          {headerName: 'grid.header.division', field: 'division' },
          {headerName: 'grid.header.executive', field: 'empExecutive' },
          {headerName: 'grid.header.est_cost', field: 'estimatedCost', class: 'text-right', cellTemplate: NumberCell  },
          {headerName: 'grid.header.est_st_data', field: 'estimatedStartDate', cellTemplate: DateFormatCell },
          {headerName: 'grid.header.approved', field: 'approvedCost', class: 'text-right', cellTemplate: NumberCell },
          {headerName: 'grid.header.sDate', field: 'actualStartDate', cellTemplate: DateFormatCell },
          {headerName: 'grid.header.quoteNo', cellTemplate: ServiceQuotationCell },
          {headerName: 'grid.header.sale_order', cellTemplate: ServiceSaleOrderCell },
          //{headerName: 'grid.header.audit', cellTemplate: ServiceAuditCell },
          {headerName: '', field: '',  cellTemplate: ProjectPipelineSetupCell },
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
  }

  ngOnInit(){
      this.coreState.projectId = this.projectId;
      this.coreState.accountId = this.accountId;
      super.populateGrid();
  }

    addNew(){
        const inputData: any = {
            data: {
                projectId: this.projectId,
            }
        };

        this.apiResolver.projectModuleCePopup(inputData, { text: `${inputData.voucherType} Add Module/ Service`, desc: '' }, ()=>{
            super.populateGrid();
        });
    }

    actionCb(row: ProjectModule)
    {
        const inputData: any = {
            id: row.id,
            //projectId: this.projectId,
            data: row
        };
        this.apiResolver.projectModuleCePopup(inputData, { text: `${row.name}`, desc: '' }, ()=>{
            super.populateGrid();
        });
    }
}
