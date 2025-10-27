import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { DateFormatCell, NumberCell, ViewExtender } from "@app-global";
import {InventoryAPIResolver} from "../services/api.resolver";
import {InventoryService} from "../services/inventory.service";
import {Inventory, InventoryQueryOptions} from "../domains/inventory.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/inventory.html'
})
export class ManageInventoryView extends ViewExtender<Inventory> implements OnInit, OnDestroy {
  @ViewChild('dateForm', { read: ViewContainerRef, static: true }) dateForm;
  override coreState: InventoryQueryOptions = new InventoryQueryOptions();
  constructor(public override service: InventoryService,
              public override activatedRoute: ActivatedRoute,
              public apiResolver: InventoryAPIResolver) {
      super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Voucher Type', field: 'voucherType' },
          {headerName: 'Product', field: 'productName' },
          {headerName: 'Quantity', field: 'netQuantity' },
          {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell },
          {headerName: 'In', field: 'quantityIn'},
          {headerName: 'Out', field: 'quantityOut'},
          {headerName: 'LastIn', field: 'lastIn', cellTemplate: DateFormatCell },
          {headerName: 'LastOut', field: 'lastOut', cellTemplate: DateFormatCell },
          {headerName: 'Cur-Bal', field: 'netAmount', class: 'text-right', cellTemplate: NumberCell }
      ];
  }

  ngOnInit(){ super.populateGrid(); }
  override ngOnDestroy(){ super.ngOnDestroy();}
  actionCb(evt: any) {  }
}
