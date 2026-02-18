import {Component, OnInit} from "@angular/core";
import {SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {BankingAPIResolver} from "../services/api.resolver";
import {BankAccountService} from "../services/bank-account.service";
import {
    AmountInBankCell, AmountInBookCell,
    BankAccountActionCell,
    BankAccountNameCell,
    BankAccountNoCell,
    BankBranchNameCell
} from "../components/bank-grid.cell";
import {BankAccount, BankAccountQueryOptions} from "../domains/bank-account.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/bank.html',
    styles: [`:host { display: contents; }`],
})
export class BankView extends ViewExtender<BankAccount> implements OnInit {
  override coreState: BankAccountQueryOptions = new BankAccountQueryOptions();
  constructor(public override activatedRoute: ActivatedRoute,
                public override service: BankAccountService, public apiResolver: BankingAPIResolver,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Bank', cellTemplate: BankBranchNameCell},
            {headerName: 'Account', cellTemplate: BankAccountNoCell},
            {headerName: 'IFSC/MICR Code', cellTemplate: BankAccountNameCell},
            {headerName: 'AMOUNT IN Bank', cellTemplate: AmountInBankCell},
            {headerName: 'AMOUNT IN Books', cellTemplate: AmountInBookCell},
            {headerName: 'Action', cellTemplate: BankAccountActionCell}
        ]
    }
    ngOnInit() { super.populateGrid(); }
    actionCb(e){}
    createNew(){}
}
