import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ExpenseAPIResolver} from "../services/api.resolver";
import {AccountGroup, AccountGroupQueryOptions} from "../domains/account-group.serializer";
import { NumberCell, ViewExtender } from "@app-global";
import {ExpenseAccountGroupService} from "../services/expense.service";

@Component({
  standalone: false,
  templateUrl: './templates/dashboard.html'
})
export class ExpenseDashboardView extends ViewExtender<AccountGroup> implements OnInit {
    public chartOptions: any;
    public pieChartOptions: any;//Partial<ChartOptions>;
  override coreState: AccountGroupQueryOptions = new AccountGroupQueryOptions();
  constructor(public apiResolver: ExpenseAPIResolver,
              public override activatedRoute: ActivatedRoute,
              public override service: ExpenseAccountGroupService) {
        super(activatedRoute, service);
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
}
