import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {VoucherCalcType, VoucherCalcTypeQueryOptions} from "../domains/calc-type.serializer";
import {VoucherCalcTypeService} from "../services/voucher-type.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/common-grid.html'
})
export class CalcTypeView extends ViewExtender<VoucherCalcType> implements OnInit
{
  override coreState: VoucherCalcTypeQueryOptions = new VoucherCalcTypeQueryOptions();
  constructor(public override service: VoucherCalcTypeService,
              public override activatedRoute: ActivatedRoute){
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
