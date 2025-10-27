import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DateFormatCell, NumberCell, ViewExtender} from "@app-global";
import {GroupLedgerCombo, GroupLedgerComboQueryOptions} from "../domains/group-ledger-combo.serializer";
import {FinanceLedgerGroupService} from "../services/finance-ledger-group.service";
import {FinanceAccountGroupNameCell} from "../grid-cell-component/account-grid-cell.component";
import {FinanceLedgerGroupLookup} from "../domains/account-group-lookup.serializer";

@Component({
  standalone: false,
    templateUrl: `./templates/account/account-group-ledger.html`,
    styles: [`:host{ display: contents; }`]
})
export class FinanceAccountGroupLedgerView extends ViewExtender<GroupLedgerCombo> implements OnInit, OnDestroy {
    @ViewChild('popupOptionsTemplate', { static: true }) public popupOptionsTemplate: TemplateRef<any>;
    @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;

    @Input() accountGroupId: number;
    override coreState: GroupLedgerComboQueryOptions = new GroupLedgerComboQueryOptions();
    constructor(public override service: FinanceLedgerGroupService, public override activatedRoute: ActivatedRoute) {
        super(activatedRoute, service);
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'head', cellTemplate: FinanceAccountGroupNameCell },
            {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
            {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell}
        ];
        super.subjectSubscription = this.service.syncListener().subscribe((r: FinanceLedgerGroupLookup) => {
            if(r){
                this.showLedgerDetails(r);
            }
        });
    }

    ngOnInit(){
        (<any>this.coreState).accountGroupId = this.accountGroupId;
        super.populateGrid();
    }
    ngOnDestroy(){ super.ngOnDestroy(); }

    showLedgerDetails(item: FinanceLedgerGroupLookup){
        this.coreState.skip = 0;
        const { accountGroupId } = item;
        (<any>this.coreState).accountGroupId = accountGroupId;
        //(<any>this.coreState).isLedgerWise = isLedgerWise;
        super.populateGrid();
    }

    updateGridData(e){}
}
