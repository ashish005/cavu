import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {VoucherSundryType, VoucherSundryTypeQueryOptions} from "../domains/sundry-type.serializer";
import {VoucherSundryTypeService} from "../services/voucher-type.service";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './templates/common-grid.html'
})
export class SundryTypeView extends ViewExtender<VoucherSundryType> implements OnInit
{
  override coreState: VoucherSundryTypeQueryOptions = new VoucherSundryTypeQueryOptions();
  constructor(public override service: VoucherSundryTypeService, public override activatedRoute: ActivatedRoute){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Has Tax', field: 'hasTax', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Has Voucher Credit', field: 'hasVoucherCredit', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(row: any){}
}
