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
          {headerName: 'name', field: 'name' },
          {headerName: 'division', field: 'division' },
          {headerName: 'executive', field: 'empExecutive' },
          {headerName: 'est_cost', field: 'estimatedCost', class: 'text-right', cellTemplate: NumberCell  },
          {headerName: 'est_st_data', field: 'estimatedStartDate', cellTemplate: DateFormatCell },
          {headerName: 'approved', field: 'approvedCost', class: 'text-right', cellTemplate: NumberCell },
          {headerName: 'sDate', field: 'actualStartDate', cellTemplate: DateFormatCell },
          {headerName: 'quoteNo', cellTemplate: ServiceQuotationCell },
          {headerName: 'sale_order', cellTemplate: ServiceSaleOrderCell },
          //{headerName: 'audit', cellTemplate: ServiceAuditCell },
          {headerName: '', field: '',  cellTemplate: ProjectPipelineSetupCell },
          {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
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
