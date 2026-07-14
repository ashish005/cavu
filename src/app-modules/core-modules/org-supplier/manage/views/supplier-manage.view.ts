import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { UserAuditInfoCell, DateFormatCell, NumberCell, GridUISwitchCellComponent, ViewExtender } from "@app-global";
import {Vendor, VendorQueryOptions} from "../domains/vendor.serializer";
import {VendorBranch} from "../domains/vendor-branch.serializer";
import {SupplierManagementService} from "../services/supplier-management.service";
import {VendorNameActionCell} from "../grid-cells/vendor-grid-cell.component";
import {VendorLookupResolver} from "../services/api.resolver";

@Component({
  templateUrl: './templates/manage.html',
  standalone: false
})
export class SupplierManageView extends ViewExtender<Vendor> implements OnInit{
  override coreState: VendorQueryOptions = new VendorQueryOptions();
  constructor(public override service: SupplierManagementService,
              public override activatedRoute: ActivatedRoute, public apiResolver: VendorLookupResolver) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'vendor_tax_ref', field: 'tradeName', cellTemplate: VendorNameActionCell },
          {headerName: 'reg_date', field: 'registrationDate', cellTemplate: DateFormatCell  },
          {headerName: 'supply_type', field: 'supplyTypeName' },
          {headerName: 'nature', field: 'natureName' },
          {headerName: 'purchaseType', field: 'purchaseTypeName' },
          {headerName: 'amt_calc_type', field: 'amountCalcType' },
          {headerName: 'cost_calc_type', field: 'costCalcType' },
          {headerName: 'tax_item', field: 'hasTaxByItem', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'tax_inclusive', field: 'hasItemInclTax', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'disc_inclusive', field: 'hasItemInclDiscount', cellTemplate: GridUISwitchCellComponent },
          {headerName: 'balance', field: 'dateWiseBalance', class: 'text-right', cellTemplate: NumberCell },
          {headerName: 'Audit', field: 'userAudit', class: 'float-right text-right', cellTemplate: UserAuditInfoCell }
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
      this.apiResolver.showVendorPopup(inputData, {text: `${row.name}`, desc: '' }, (resp: any)=>{
          this.populateGrid();
      });
  }

  createNew(){
      const inputData: any = {
          id: null,
          data: new VendorBranch()
      };
      this.apiResolver.showVendorPopup(inputData, {text: 'New Vendor', desc: 'New Vendor is getting created' }, (resp: any)=>{
          this.populateGrid();
      });
  }
  showDetails(project){}
}
