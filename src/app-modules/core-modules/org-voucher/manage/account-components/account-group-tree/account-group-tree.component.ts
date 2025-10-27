import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FinanceLedgerGroupService} from "../../services/finance-ledger-group.service";
import {FinanceLedgerGroupLookup} from "../../domains/account-group-lookup.serializer";

@Component({
    selector: 'account-group-tree',
    templateUrl: './account-group-tree.html',
    styles: [`:host { display: contents;}`]
})
export class AccountGroupTreeComponent implements OnInit {
    groups: Array<FinanceLedgerGroupLookup>;
    query: string;

    @Input() isPopup: boolean;

    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEditOk: EventEmitter<any> = new EventEmitter<any>();
    constructor(public service: FinanceLedgerGroupService) {}
    ngOnInit(){
        const success = (resp)=>{ this.groups = resp; };
        this.service.GetFinanceAccountGroupLookup().subscribe(success);
    }

    showLedgerDetails(item: FinanceLedgerGroupLookup){
        this.onOk.emit(item)
    }

    editAccountGroupAction(item: FinanceLedgerGroupLookup){
        this.onEditOk.emit(item)
    }
    addAccountGroup(){
        this.onEditOk.emit(new FinanceLedgerGroupLookup())
    }
}