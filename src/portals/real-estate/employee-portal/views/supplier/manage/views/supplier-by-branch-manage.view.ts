import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { NumberCell, ViewExtender } from "@app-global";
import {VendorBranch, VendorBranchQueryOptions} from "../domains/vendor-branch.serializer";
import {VendorLookupResolver} from "../services/api.resolver";
import {
    VendorBranchNameActionCell,
    VendorBranchRegistrationCell
} from "../grid-cells/vendor-branch-grid-cell.component";
import {SupplierByBranchManagementService} from "../services/supplier-by-branch-management.service";

@Component({
  templateUrl: './templates/manage.html',
  standalone: false
})
export class SupplierByBranchManageView extends ViewExtender<VendorBranch> implements OnInit{
  override coreState: VendorBranchQueryOptions = new VendorBranchQueryOptions();
  constructor(public override service: SupplierByBranchManagementService,
              public apiResolver: VendorLookupResolver,
              public override activatedRoute: ActivatedRoute) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'grid.header.name', field: 'name', cellTemplate: VendorBranchNameActionCell },
          {headerName: 'grid.header.supply_type', field: 'supplyTypeName' },
          {headerName: 'grid.header.nature', field: 'natureName' },
          {headerName: 'grid.header.purchaseType', field: 'purchaseTypeName' },
          {headerName: 'grid.header.reg_date', field: 'registrationDate', cellTemplate: VendorBranchRegistrationCell  },
          {headerName: 'grid.header.balance', field: 'dateWiseBalance', class: 'text-right', cellTemplate: NumberCell },
          //{headerName: 'grid.header.audit', field: 'userAudit', class: 'float-right text-right', cellTemplate: UserAuditInfoCell }
      ];
  }

  ngOnInit(){
    super.populateGrid();
  }

  actionCb(row: VendorBranch){
      const inputData: any = {
          id: row.id,
          vendorId: row.vendorId,
          accountId: row.accountId,
          data: row
      };
      this.apiResolver.showVendorBranchPopup(inputData, {text: `${row.name}`, desc: '' }, (resp: any)=>{
          this.populateGrid();
      });
  }

  createNew(){
      const inputData: any = {
          id: null,
          data: new VendorBranch()
      };
      this.apiResolver.showVendorBranchPopup(inputData, {text: 'New Vendor', desc: 'New Vendor is getting created' }, (resp: any)=>{
          this.populateGrid();
      });
  }

  showDetails(project){}
}
