import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {RecurringInvoiceService} from "../services/recurring-invoice.service";
import {RecurringInvoice, RecurringInvoiceQueryOptions} from "../domains/recurring-invoice.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/default-view.html'
})
export class RecurringInvoiceView extends ViewExtender<RecurringInvoice> implements OnInit{
    projectId: string;
    accountId: string;
    override coreState: RecurringInvoiceQueryOptions = new RecurringInvoiceQueryOptions();
  constructor(public override service: RecurringInvoiceService, public override activatedRoute: ActivatedRoute) {
      super(activatedRoute, service);
      this.gridOptions.columnDefs = [
          {headerName: 'Name', field: 'name' },
          {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ];
  }

  ngOnInit(){
      (<any>this.coreState).projectId = this.projectId;
      (<any>this.coreState).accountId = this.accountId;
      super.populateGrid();
  }

  addNew(){}
  actionCb(e: any){}
}
