import {Component, OnInit} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {BankAccountService} from "../services/bank-account.service";
import {BankAccountCeComponent} from "../components/bank-account-ce.component";
import {BankAccount, BankAccountQueryOptions} from "../domains/bank-account.serializer";
import {Bank} from "../domains/bank.serializer";

@Component({
    standalone: false,
    templateUrl: './templates/bank.html',
    styles: [`:host { display: contents; }`],
})
export class BankView extends ViewExtender<BankAccount> implements OnInit {
    override coreState: BankAccountQueryOptions = new BankAccountQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: BankAccountService,
                protected sharedService: SharedService) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Bank', field: 'bankName'},
            {headerName: 'Branch Name', field: 'branchName'},
            {headerName: 'Account', field: 'accountName'},
            {headerName: 'Account No', field: 'bankAccountNo'},
            {headerName: 'IFSC Code', field: 'ifscCode'},
            {headerName: 'MICR Code', field: 'micrCode'}
        ]
    }

    ngOnInit() { super.populateGrid(); }

    bankClick(row: Bank){
        this.coreState.bankId = row.id;
        super.populateGrid();
    }

    actionCb(row: BankAccount) {
        const inputData: any = {
            id: row.id,
            data: row
        };
        this.showBankAccountPopup(inputData, {text: `${row.bankName}`, desc: ''});
    }

    createNewAccount(row: Bank) {
        const inputData: any = {
            id: null,
            data: {
                bankId: row.id,
                accountName: row.name
            }
        };
        this.showBankAccountPopup(inputData, {text: 'New Account', desc: 'New Account is getting created'});
    }

    showBankAccountPopup(inputData, popupHeader) {
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any) => {
            this.sharedService.destroy();
            this.coreState.bankId = inputData.data?.bankId;
            super.populateGrid();
        };
        const failure = () => {
            this.sharedService.destroy();
        };
        let modal$ = this.sharedService.showCustomPopup(BankAccountCeComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
