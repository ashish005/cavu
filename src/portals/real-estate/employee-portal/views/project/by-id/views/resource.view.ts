import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {ProjectModule} from "../domains/project-module.serializer";
import {ProjectAPIResolver, ProjectResourceService} from "../services";
import {ProjectResource, ProjectResourceQueryOptions} from "../domains/project-resource.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/default-view.html'
})
export class ResourceView extends ViewExtender<ProjectResource> implements OnInit{
    projectId: string;
    accountId: string;
    override coreState: ProjectResourceQueryOptions = new ProjectResourceQueryOptions();
  constructor(public override service: ProjectResourceService, public apiResolver: ProjectAPIResolver,
              public override activatedRoute: ActivatedRoute) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name' },
          {headerName: 'Resource Type', field: 'resourceType' },
          {headerName: 'Billing Type', field: 'billingType' },
          //{headerName: 'Module/ Service', cellTemplate: AssociateProjectNameCell },
          /*{headerName: 'Estimated Start Date', field: 'estimatedStartDate' },
          {headerName: 'Estimated Cost', field: 'estimatedCost' },
          {headerName: 'ActualStartDate', field: 'actualStartDate' },
          {headerName: 'Approved Cost', field: 'approvedCost' },*/
          /*{headerName: 'Employee', cellTemplate: AssociateEmployeeCell },
          {headerName: 'Vendor', cellTemplate: AssociateVendorCell },*/
          //{headerName: 'Purchase Order', cellTemplate: AssociatePurchaseOrderCell }
      ];
  }

  ngOnInit(){
      this.coreState.projectId = this.projectId;
      this.coreState.accountId = this.accountId;
      super.populateGrid();
  }

    addNew(){
        const inputData: any = {
            data: null,
            projectId: this.projectId
        };

        this.apiResolver.showResourceCePopup(inputData, { text: `New Associate`, desc: '' }, ()=>{
            this.populateGrid();
        });
    }
    actionCb(row: ProjectModule){
        const inputData: any = {
            id: row.id,
            projectId: this.projectId,
            data: row
        };
        this.apiResolver.showResourceCePopup(inputData, { text: `Associate: ${row.name}`, desc: '' }, ()=>{
            this.populateGrid();
        });
    }
}
