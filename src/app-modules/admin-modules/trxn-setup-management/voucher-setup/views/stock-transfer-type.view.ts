import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StockTransferTypeService} from "../services/voucher-type.service";
import {StockTransferType, StockTransferTypeQueryOptions} from "../domains/stock-transfer-type.serializer";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/common-grid.html'
})
export class StockTransferTypeView extends ViewExtender<StockTransferType> implements OnInit
{
  override coreState: StockTransferTypeQueryOptions = new StockTransferTypeQueryOptions();
  constructor(public override service: StockTransferTypeService, public override activatedRoute: ActivatedRoute)
  {
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Order', field: 'sortOrder', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'isDefault', field: 'isDefault', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }

    actionCb(row: any){}
}
