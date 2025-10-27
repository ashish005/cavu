import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {DateFormatCell, NumberCell, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {Account, AccountQueryOptions} from "../domains/account.serializer";
import {LedgerService} from "../services/ledger.service";
import {LedgerNameCellComponent} from "../grid-action-cell";
import {AccountingAPIResolver} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/ledger.html',
  styles: [`
  @media only screen and (max-width: 800px) {

  /* Force table to not be like tables anymore */
  #no-more-tables table,
  #no-more-tables thead,
  #no-more-tables tbody,
  #no-more-tables th,
  #no-more-tables td,
  #no-more-tables tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  #no-more-tables thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  #no-more-tables tr {
    border: 1px solid #ccc;
  }

  #no-more-tables td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    white-space: normal;
    text-align: left;
  }

  #no-more-tables td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: bold;
  }

  /*
    Label the data
    */
  #no-more-tables td:before { content: attr(data-title); }
}
  `
  ]
})
export class LedgerView extends ViewExtender<Account> implements OnInit, OnDestroy {
  query: string;
  submitted: boolean = false;

  listAccountGroup: any;//FinanceLedgerGroupLookup
  listAccount: Account;
  override coreState: AccountQueryOptions = new AccountQueryOptions();
  constructor(public override service: LedgerService,
              public override activatedRoute: ActivatedRoute,
              private apiResolver: AccountingAPIResolver)
  {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name', cellTemplate: LedgerNameCellComponent },
      {headerName: 'Print Name', field: 'printName'},
      {headerName: 'Group Name', field: 'accountGroupName'},
      {headerName: 'BillByBill', field: 'billByBill'},
      {headerName: 'Balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell},
      // {headerName: 'Opening Balance', field: 'openingBalance', class: 'text-right', cellTemplate: NumberCell},
      // {headerName: 'Opening Date', field: 'openingBalanceDate', cellTemplate: DateFormatCell },
      // {headerName: 'Credit', field: 'credit', class: 'text-right', cellTemplate: NumberCell},
      // {headerName: 'Debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell},
      // {headerName: 'Closing Balance', field: 'closingBalance', class: 'text-right', cellTemplate: NumberCell}
    ];
  }

  ngOnInit(){ }

  override ngOnDestroy(){ super.ngOnDestroy(); }

  showDetails(item: any){
    this.listAccountGroup = item;
    this.coreState.accountGroupId = item.id;
    //this.coreState.skip = 0;
    super.populateGrid();
  }

  addAccount(){
    const inputData = {
      id: null,
      data: null
    };
    this.apiResolver.accountPopup(inputData,  { text: 'Account', desc: `Add Account` }, ()=>{ super.populateGrid(); });
  }
    actionCb(row: Account) {
        const inputData = {
            id: row.id,
            data: row
        };

        this.apiResolver.accountPopup(inputData,  { text: 'Account', desc: `Update Account` }, ()=>{ super.populateGrid(); });
    }
}
