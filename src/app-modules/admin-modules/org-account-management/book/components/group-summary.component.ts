import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {
    LedgerGroupSummary,
    LedgerGroupSummaryQueryOptions
} from "../domains/trial-balance/ledger-group-summary.serializer";
import {LedgerGroupSummaryService} from "../services/account-book.service";

@Component({
  standalone: false,
    selector: 'ledger-group-summary',
    templateUrl: './templates/ledger-group-summary.html',
    styles: [`:host { display: contents;}`]
})
export class GroupSummaryComponent extends ViewExtender<LedgerGroupSummary> implements OnInit {
    query: string;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEditOk: EventEmitter<any> = new EventEmitter<any>();
    override coreState: LedgerGroupSummaryQueryOptions = new LedgerGroupSummaryQueryOptions();
    constructor(public override activatedRoute: ActivatedRoute,
                public override service: LedgerGroupSummaryService) {
        super(activatedRoute, service);
    }

    ngOnInit(){}

    searchActionCb(row){
        this.coreState.startDate = row.startDate;
        this.coreState.endDate = row.endDate;
        super.populateGrid();
    }

    showLedgerDetails(item: LedgerGroupSummary){
        this.onOk.emit(item)
    }

    editAccountGroupAction(item: LedgerGroupSummary){
        this.onEditOk.emit(item)
    }
    addAccountGroup(){
        this.onEditOk.emit(new LedgerGroupSummary())
    }
}
