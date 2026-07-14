import {Component, OnInit} from "@angular/core";
import { GridUISwitchCellComponent, SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {BankingAPIResolver} from "../services/api.resolver";
import {BankAccountNameCell, BankAccountNoCell, BankBranchNameCell} from "../components/bank-grid.cell";
import {TrxnTypeAllocationService} from "../services/trxn-type-allocation.service";
import {TrxnTypeAllocation, TrxnTypeAllocationQueryOptions} from "../domains/trxn-type-allocation.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/trxn-type-allocation.html',
    styles: [`:host { display: contents; }`],
})
export class TrxnTypeAllocationView extends ViewExtender<TrxnTypeAllocation> implements OnInit {
  override coreState: TrxnTypeAllocationQueryOptions = new TrxnTypeAllocationQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
              public override service: TrxnTypeAllocationService,
              public apiResolver: BankingAPIResolver,
              protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Bank', field: 'bankName'},
            {headerName: 'Branch', cellTemplate: BankBranchNameCell},
            {headerName: 'Account No', cellTemplate: BankAccountNoCell},
            {headerName: 'Account', cellTemplate: BankAccountNameCell},
            {headerName: 'status', field: 'status', cellTemplate: GridUISwitchCellComponent}
        ]
    }

    ngOnInit() { super.populateGrid(); }
}
