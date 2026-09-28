import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BankTransactionTypeService} from "../services/bank-transaction-type.service";
import {BankTransactionType, BankTransactionTypeQueryOptions} from "../domains/bank-transaction-type.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/card-type.html'
})
export class BankTransactionTypeView extends ViewExtender<BankTransactionType> implements OnInit{
  override coreState: BankTransactionTypeQueryOptions = new BankTransactionTypeQueryOptions();
  constructor(public override service: BankTransactionTypeService, public override activatedRoute: ActivatedRoute,){
        super(activatedRoute, service);
        this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Code', field: 'code' },
            {headerName: 'Name', field: 'name' },
            {headerName: 'Direction', field: 'directionName' },
            {headerName: 'Reconciliation Relevant', field: 'isReconciliationRelevant', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ];
    }

    ngOnInit(){ super.populateGrid(); }
    actionCb(e){}
}
