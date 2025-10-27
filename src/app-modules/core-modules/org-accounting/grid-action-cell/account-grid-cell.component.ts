import { Component } from "@angular/core";
import { DynamicComponent } from "@app-global";
import {AccountingAPIResolver} from "../services";

@Component({
  standalone: false,
  template: '<a class="text-primary text-xs" (click)="showMyDetails(context)">{{context.name}}</a>'
})
export class LedgerNameCellComponent extends DynamicComponent{
  constructor(private apiResolver: AccountingAPIResolver){ super(); }

    showMyDetails(row){
        /*const { id } = row;
        const inputData: any = {
            accountId: id,
            viewType: 'info',
            actionType: ACTION_ENUM.SHOW
        };
        this.apiResolver.showLedgerWiseGridReportPopup(inputData, { text: `${this.context.name}`, desc: 'Ledger Details' });*/
    }
}

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500" (click)="showDetails(context)">{{ context?.head }}</a>`
})
export class AccountNameCell extends DynamicComponent{
    constructor(private apiResolver: AccountingAPIResolver){ super(); }

    showDetails(row){
        /*const { accountId } = row;
        const inputData: any = {
            accountId: accountId,
            viewType: 'account',
            actionType: ACTION_ENUM.SHOW
        };
        this.apiResolver.showLedgerWiseGridReportPopup(inputData, { text: `${this.context.accountName}`, desc: `Account Manage` });*/
    }
}

@Component({
  standalone: false,
    template: `<a class="text-primary text-xs _500" (click)="showDetails(context)">{{ context?.head }}</a>`
})
export class AccountGroupNameCell extends DynamicComponent {
    constructor(private apiResolver: AccountingAPIResolver){ super(); }

    showDetails(row) {
       /* const { accountGroupId } = row;
        const inputData: any = {
            accountGroupId: accountGroupId,
            viewType: 'ledger',
            actionType: ACTION_ENUM.SHOW
        };
        this.apiResolver.showAccountGroupLedgerView(inputData, { text: `${this.context.head}`, desc: `Account Group` });*/
    }
}
