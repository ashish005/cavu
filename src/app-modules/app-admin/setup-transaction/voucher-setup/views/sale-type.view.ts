import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SaleTypeService} from "../services/voucher-type.service";
import {SaleType, SaleTypeQueryOptions} from "../domains/sale-type.serializer";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({ standalone: false, templateUrl: './templates/common-grid.html' })
export class SaleTypeView extends ViewExtender<SaleType> implements OnInit
{
  override coreState: SaleTypeQueryOptions = new SaleTypeQueryOptions();
  constructor(public override service: SaleTypeService, public override activatedRoute: ActivatedRoute){
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
