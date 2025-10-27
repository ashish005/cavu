import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {VoucherTypeService} from "../services/voucher-type.service";
import {PhaseStatusLookup, VoucherType, VoucherTypeQueryOptions} from "../domains/voucher-type.serializer";
import {GridUISwitchCellComponent, ViewExtender, ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {VoucherConfigComponent} from "../components/voucher-config.component";
import {VoucherTypePhaseCellComponent} from "../grid-cells";

@Component({ standalone: false, templateUrl: './templates/common-grid.html' })
export class VoucherTypeView extends ViewExtender<VoucherType> implements OnInit{
  override coreState: VoucherTypeQueryOptions = new VoucherTypeQueryOptions();
  constructor(public override service: VoucherTypeService,
              public override activatedRoute: ActivatedRoute,
              private sharedService: SharedService)
  {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Alias', field: 'name' },
            {headerName: 'No. Label', field: 'voucherNoDisplay' },
            {headerName: 'Date Label', field: 'voucherDateDisplay' },
            {headerName: 'Voucher No', field: 'voucherNo' },
            {headerName: 'Phases', cellTemplate: VoucherTypePhaseCellComponent},

            {headerName: 'Accounting', field: 'enableAccounting', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Inventory', field: 'enableInventory', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'grid.header.status', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
        ];
    }

    ngOnInit(){ super.populateGrid(); }

    actionCb(row: VoucherType){
        const inputData: any = {
            id: row.id,
            data: row
        };

        const popup = {
            header: { text: `${row.name} config`, desc: `` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const success = (resp: any) => {
            this.sharedService.destroy();
            super.populateGrid();
        };

        const error = (resp: any) => { this.sharedService.destroy(); };
        let modal$ = this.sharedService.showCustomPopup(VoucherConfigComponent, popup, inputData);
        modal$.then(success, error);
    }
}
