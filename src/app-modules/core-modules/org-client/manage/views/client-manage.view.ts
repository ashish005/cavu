import {Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientAPIResolver} from "../services";
import { NumberCell, ViewExtender } from "@app-global";
import {
    ClientContactCell,
    ClientDueInfoCell,
    ClientNameActionCell,
    ClientRegInfoCell
} from "../grid-cells/client-grid-cell.component";
import {Client, ClientQueryOptions} from "../domains/client.serializer";
import {ClientService} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/manage.html'
})
export class ClientManageView extends ViewExtender<Client> implements OnInit {
  override coreState: ClientQueryOptions = new ClientQueryOptions();
  constructor(public override service: ClientService,
              public apiResolver: ClientAPIResolver,
              public override activatedRoute: ActivatedRoute) {
      super(activatedRoute, service);
    this.gridOptions.columnDefs = [
        {headerName: 'name', field: 'name', cellTemplate: ClientNameActionCell },
        {headerName: 'contact', field: 'name', cellTemplate: ClientContactCell },
        {headerName: 'reg', field: 'name', cellTemplate: ClientRegInfoCell },
        {headerName: 'taxReg', field: 'taxRegistrationNo' },
        // {headerName: 'approved', field: 'approved', class: 'text-right', cellTemplate: NumberCell },
        // {headerName: 'income', field: 'receipt', class: 'text-right', cellTemplate: NumberCell },
        // {headerName: 'expense', field: 'expense', class: 'text-right', cellTemplate: NumberCell },
        // {headerName: 'due', field: 'overDue', class: 'text-right', cellTemplate: NumberCell },
        {headerName: 'balance', field: 'balance', class: 'text-right', cellTemplate: NumberCell },
        {headerName: 'due', field: 'due', cellTemplate: ClientDueInfoCell },
        // {headerName: 'debit', field: 'debit', class: 'text-right', cellTemplate: NumberCell },
        {headerName: 'audit', field: 'userAudit', class: 'float-right' }
    ];
  }

  ngOnInit(){
    super.populateGrid();
  }

  /*actionCb(row: Client){
    this.router.navigate([row.id], {relativeTo: this.activatedRoute.parent});
  }*/

  get isOverDueActive(){
    return (<any>this.coreState).searchAction == 'overdue';
  }

  get isOutstandingActive(){
    return (<any>this.coreState).searchAction == 'outstanding';
  }

  get isInDraftActive(){
    return (<any>this.coreState).searchAction == 'indraft';
  }

  getOverDue(){
    this.clearAllQueryParam();
      (<any>this.coreState).searchAction = 'overdue';
  }

  getOnlyOutstanding(){
    this.clearAllQueryParam();
      (<any>this.coreState).searchAction = 'outstanding';
  }

  getOnlyInDraft(){
      this.clearAllQueryParam();
      (<any>this.coreState).searchAction = 'indraft';
  }

  clearAllQueryParam(){
      (<any>this.coreState).searchAction = null;
  }

  removeFilterAction(){
      (<any>this.coreState).searchAction = null;
    super.populateGrid();
  }

  actionCb(row: Client){
      const inputData: any = {
          id: row.id,
          data: row
      };
      this.apiResolver.showClientCEPopup(inputData, { text: `${row.name}`, desc: '' }, ()=>{
          this.populateGrid();
      });
  }

    createNew(){
        const inputData: any = {
            id: null,
            data: null
        };
        this.apiResolver.showClientCEPopup(inputData, { text: `New Client`, desc: 'New Client creation screen' }, ()=>{
            this.populateGrid();
        });
    }

  searchActionCb(row: any){
      //this.coreState.searchAction = row.startDate;
      this.updateGrid(this.coreState);
  }
}
