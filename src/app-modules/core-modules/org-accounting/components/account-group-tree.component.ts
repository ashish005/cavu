import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CoreAccountGroupLookup} from "../domains/lookup.serializer";
import {AccountingAPIResolver} from "../services";

@Component({
  standalone: false,
    selector: 'ledger-group-tree',
    templateUrl: './templates/account-group-tree.html',
    styles: [`:host { display: contents;}`]
})
export class AccountGroupTreeComponent implements OnInit {
    query: string;
    constructor(public apiResolver: AccountingAPIResolver) { }
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(){}
    showLedgerDetails(item: CoreAccountGroupLookup){
        this.onOk.emit(item)
    }
    editAccountGroupAction(row: CoreAccountGroupLookup){
        const inputData = {
            id: row.id,
            data: row
        };

        this.apiResolver.accountGroupPopup(inputData, { text: 'Update Account Group', desc: `Update Account Group` });
    }
    addAccountGroup(){
        const inputData = {
            id: null,
            data: new CoreAccountGroupLookup()
        };
        this.apiResolver.accountGroupPopup(inputData, { text: 'New Account Group', desc: `Account Group` });
    }
}
