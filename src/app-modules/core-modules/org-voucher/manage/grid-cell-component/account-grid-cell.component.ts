import {Component, Input} from "@angular/core";
import {DynamicComponent} from "@app-global";
import {FinanceLedgerGroupService} from "../services/finance-ledger-group.service";

@Component({
    template: `<a class="text-primary text-xs _500" (click)="showDetails(context)" *ngIf="!context?.isLedgerWise">{{ context?.name }}</a><span *ngIf="context?.isLedgerWise">{{ context?.head }}</span>`
})
export class FinanceAccountGroupNameCell extends DynamicComponent{
    constructor(public service: FinanceLedgerGroupService){ super(); }

    showDetails(row: any)
    {
        const { accountGroupId } = row;
        const isLedgerWise = row.isGroupLedgerWise();
        this.service.syncGroupLedger({ accountGroupId, isLedgerWise });
    }
}
