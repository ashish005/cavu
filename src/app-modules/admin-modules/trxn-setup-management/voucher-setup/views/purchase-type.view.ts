import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {PurchaseTypeService} from "../services/voucher-type.service";
import {PurchaseType, PurchaseTypeQueryOptions} from "../domains/purchase-type.serializer";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/common-grid.html'
})
export class PurchaseTypeView extends ViewExtender<PurchaseType> implements OnInit
{
  override coreState: PurchaseTypeQueryOptions = new PurchaseTypeQueryOptions();
  constructor(public override service: PurchaseTypeService, public override activatedRoute: ActivatedRoute){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Order', field: 'sortOrder', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'isDefault', field: 'isDefault', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }

    actionCb(row: any){}
}
