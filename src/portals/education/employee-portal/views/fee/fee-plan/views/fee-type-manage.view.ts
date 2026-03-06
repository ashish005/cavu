import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CurrencyCell, GridUISwitchCellComponent, NumberCell, ViewExtender} from "@app-global";
import {FeeType, FeeTypeQueryOptions} from "../domains/fee-type.serializer";
import {FeeTypeService} from "../services/fee-type.service";

@Component({
    standalone: false,
    templateUrl: './templates/manage-master.html'
})
export class FeeTypeManageView extends ViewExtender<FeeType> implements OnInit, OnDestroy {
    override coreState: FeeTypeQueryOptions = new FeeTypeQueryOptions();

    constructor(public override service: FeeTypeService,
                public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        const translate_path = 'modules.project.manage.grid';
        this.gridOptions.columnDefs = [
            {headerName: `${translate_path}.name`, field: 'name'},

            {headerName: `Account`, field: 'accountName'},
            {headerName: `Task`, field: 'defaultTaskName'},
            {headerName: `Frequency`, field: 'defaultFrequencyName'},
            {headerName: `Deposit Duration`, field: 'depositDurationType'},
            {headerName: `Voucher`, field: 'voucherTypeName'},
            {headerName: `Amount`, field: 'amount', cellTemplate: CurrencyCell},
            {headerName: `Refundable`, field: 'isRefundable', cellTemplate: GridUISwitchCellComponent},
            {headerName: `sortOrder`, field: 'sortOrder', cellTemplate: NumberCell}
        ];
    }

    ngOnInit() {
        super.populateGrid();
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
    }

    actionCb(row: FeeType) {
        const inputData: any = {
            id: row.id,
            data: row
        };
        // this.feePlanFactory.ceFeeTypePopup(inputData, {text: `${row.name}`, desc: ''}).then((r)=>{
        //     super.populateGrid();
        // });
    }

    createNew() {
        const inputData: any = {
            id: null,
            data: {}
        };
        // this.feePlanFactory.ceFeeTypePopup(inputData, {text: 'New Concession', desc: ''}).then((r) => {
        //     super.populateGrid();
        // });
    }
}

