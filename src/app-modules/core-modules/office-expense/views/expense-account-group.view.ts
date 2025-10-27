import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender, NumberCell, SharedService } from "@app-global";
import {ExpenseAPIResolver} from "../services/api.resolver";
import {AccountGroup, AccountGroupQueryOptions} from "../domains/account-group.serializer";
import {ExpenseAccountGroupService} from "../services/expense.service";

@Component({
  standalone: false,
  templateUrl: './templates/group.html'
})
export class ExpenseAccountGroupView extends ViewExtender<AccountGroup> implements OnInit, OnDestroy {
  override coreState: AccountGroupQueryOptions = new AccountGroupQueryOptions();
  constructor(public apiResolver: ExpenseAPIResolver,
              public override activatedRoute: ActivatedRoute,
              public override service: ExpenseAccountGroupService,
              public sharedService: SharedService) {
    super(activatedRoute, service);
      this.gridOptions.header.edit = false;
      this.gridOptions.columnDefs = [
          {headerName: 'Head', field: 'head', class: 'pl-3' },
          {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
          {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
          {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
          {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell}
      ];
  }

  ngOnInit(){
      super.populateGrid();
  }

    override ngOnDestroy()
    {
        super.ngOnDestroy();
    }

  actionCb(row: any){}

  createNew(){}
  remove(row){}
  performAction(row){}
}
