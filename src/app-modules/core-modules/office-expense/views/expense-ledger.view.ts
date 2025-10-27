import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender, NumberCell, SharedService} from "@app-global";
import {Expense} from "../domains/expense.serializer";
import {ExpenseAPIResolver} from "../services/api.resolver";
import {ExpenseAccountService} from "../services/expense.service";
import {Account, AccountQueryOptions} from "../domains/account.serializer";
import {LookupAccountGroup} from "../domains/expense.lookup";

@Component({
  standalone: false,
  templateUrl: './templates/ledger.html'
})
export class ExpenseLedgerView extends ViewExtender<Account> implements OnInit, OnDestroy {
  item: LookupAccountGroup;
  override coreState: AccountQueryOptions = new AccountQueryOptions();
  constructor(public apiResolver: ExpenseAPIResolver,
              public override service: ExpenseAccountService,
              public sharedService: SharedService,
              public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Account', field: 'name' },
          {headerName: 'Group', field: 'accountGroupName' },
          {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
          {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
          {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
          {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell},
      ];

      this.activatedRoute.params.subscribe((parms: { id: any }) =>
      {
          const r = parms.id;
          this.item = this.apiResolver.masterType.findGroupById(parms.id);
          (<any>this.coreState).accountGroupId = (r > 0) ? r  : null;
          super.populateGrid();
      });
  }

  ngOnInit() {
      /*const r = this.activatedRoute.snapshot.params.id;
      (<any>this.coreState).accountGroupId = (r > 0) ? r  : null;
      super.populateGrid();*/
  }

    override ngOnDestroy()
    {
        super.ngOnDestroy();
    }

  actionCb(row: Expense){}

  createNew(){}
}
